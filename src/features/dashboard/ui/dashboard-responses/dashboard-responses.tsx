"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import { TEXT_INPUT_DEBOUNCE_MS } from "@/core/constants/app.constants";
import { getDictionary } from "@/core/i18n";
import { ListFilter, LogOut, RefreshCw, Trash2 } from "@/core/icons";
import { appRoutes } from "@/core/routes/app.routes";
import { ADMIN_SURVEY_LIST_DEFAULT_PAGE_SIZE } from "@/features/dashboard/domain/admin-survey-filters";
import type { AdminSurveyResponseDto } from "@/features/dashboard/infrastructure/admin-survey-response.dto";
import {
  deleteAdminSurveyResponsesRequest,
  fetchAdminSurveyResponses,
  logoutAdminRequest,
  type AdminSurveyListQuery,
} from "@/features/dashboard/ui/dashboard-api-client";
import { DashboardConfirmDialog } from "@/features/dashboard/ui/dashboard-confirm-dialog/dashboard-confirm-dialog";
import { DashboardFiltersSheet } from "@/features/dashboard/ui/dashboard-filters-sheet/dashboard-filters-sheet";
import { DashboardNav } from "@/features/dashboard/ui/dashboard-nav/dashboard-nav";
import { DashboardResponseDetailPanel } from "@/features/dashboard/ui/dashboard-response-detail-panel/dashboard-response-detail-panel";
import {
  countActiveFilters,
  INITIAL_FILTERS,
  type FilterState,
} from "@/features/dashboard/ui/dashboard-responses/dashboard-filter-state";
import { DashboardFiltersForm } from "@/features/dashboard/ui/dashboard-responses/dashboard-filters-form";
import { DashboardTruncatedCell } from "@/features/dashboard/ui/dashboard-responses/dashboard-truncated-cell";
import { useDashboardSplitWidth } from "@/features/dashboard/ui/dashboard-responses/use-dashboard-split-width";
import { CButton, CLoader } from "@/design-system";

import "./dashboard-responses.scss";

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatContact(
  response: AdminSurveyResponseDto,
  empty: string,
): string {
  if (response.email) {
    return response.email;
  }
  if (response.whatsapp) {
    return response.whatsapp;
  }
  return empty;
}

function formatDate(response: AdminSurveyResponseDto, empty: string): string {
  const raw = response.submittedAt ?? response.updatedAt;
  if (!raw) {
    return empty;
  }

  return dateFormatter.format(new Date(raw));
}

export function DashboardResponses() {
  const t = getDictionary("es");
  const list = t.dashboard.list;
  const labels = t.survey.labels;
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<AdminSurveyResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [selected, setSelected] = useState<AdminSurveyResponseDto | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
  const closeDetail = useCallback(() => setSelected(null), []);
  const closeFiltersSheet = useCallback(() => setFiltersSheetOpen(false), []);
  const closeConfirmDelete = useCallback(() => {
    if (deleting) {
      return;
    }
    setConfirmDeleteOpen(false);
    setDeleteError(null);
  }, [deleting]);
  const {
    bodyRef,
    widthPx,
    dragging,
    minWidthPx,
    maxWidthPx,
    onDividerPointerDown,
    onDividerKeyDown,
  } = useDashboardSplitWidth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, TEXT_INPUT_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const query = useMemo<AdminSurveyListQuery>(
    () => ({
      status: filters.status ?? undefined,
      ageGroups: filters.ageGroups,
      workAreas: filters.workAreas,
      meetingSlots: filters.meetingSlots,
      genders: filters.genders,
      search: debouncedSearch,
      page: filters.page,
      pageSize: ADMIN_SURVEY_LIST_DEFAULT_PAGE_SIZE,
    }),
    [
      debouncedSearch,
      filters.ageGroups,
      filters.genders,
      filters.meetingSlots,
      filters.page,
      filters.status,
      filters.workAreas,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchAdminSurveyResponses(query, controller.signal)
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
        setLastUpdatedAt(new Date());
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setItems([]);
        setTotal(0);
        setError(list.loadError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [query, reloadKey, list.loadError]);

  useEffect(() => {
    setFilters((current) =>
      current.page === 1 ? current : { ...current, page: 1 },
    );
  }, [debouncedSearch]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (media.matches) {
        setFiltersSheetOpen(false);
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const activeFilterCount = countActiveFilters(filters);
  const pageIds = useMemo(() => items.map((item) => item.id), [items]);
  const checkedCount = checkedIds.size;
  const allPageChecked =
    pageIds.length > 0 && pageIds.every((id) => checkedIds.has(id));
  const somePageChecked =
    pageIds.some((id) => checkedIds.has(id)) && !allPageChecked;

  function toggleCheckedId(id: string) {
    setCheckedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function togglePageChecked() {
    setCheckedIds((current) => {
      const next = new Set(current);
      if (allPageChecked) {
        for (const id of pageIds) {
          next.delete(id);
        }
      } else {
        for (const id of pageIds) {
          next.add(id);
        }
      }
      return next;
    });
  }

  async function handleConfirmDelete() {
    if (deleting || checkedIds.size === 0) {
      return;
    }

    const ids = [...checkedIds];
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteAdminSurveyResponsesRequest(ids);
      setCheckedIds(new Set());
      setConfirmDeleteOpen(false);
      setSelected((current) =>
        current && ids.includes(current.id) ? null : current,
      );
      setReloadKey((value) => value + 1);
    } catch {
      setDeleteError(list.deleteConfirm.error);
    } finally {
      setDeleting(false);
    }
  }

  function patchFilters(
    patch:
      | Partial<Omit<FilterState, "page">>
      | ((current: FilterState) => Partial<Omit<FilterState, "page">>),
  ) {
    setFilters((current) => {
      const nextPatch = typeof patch === "function" ? patch(current) : patch;
      return {
        ...current,
        ...nextPatch,
        page: 1,
      };
    });
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await logoutAdminRequest();
      router.replace(appRoutes.dashboardLogin);
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    response: AdminSurveyResponseDto,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(response);
    }
  }

  const filtersFormProps = {
    filters,
    onSearchChange: (value: string) =>
      setFilters((current) => ({ ...current, search: value })),
    onPatch: patchFilters,
    onClear: () => setFilters(INITIAL_FILTERS),
  };

  return (
    <main className="f-dashboard-responses">
      <motion.header
        className="f-dashboard-responses__header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <div className="f-dashboard-responses__top">
          <p className="f-dashboard-responses__brand">{t.appName}</p>
          <CButton
            type="button"
            variant="ghost"
            fullWidth={false}
            disabled={loggingOut}
            className="f-dashboard-responses__logout"
            onClick={handleLogout}
          >
            <span className="f-dashboard-responses__logout-inner">
              <LogOut size={16} strokeWidth={1.75} aria-hidden />
              {loggingOut ? t.dashboard.loggingOut : t.dashboard.logout}
            </span>
          </CButton>
        </div>
        <DashboardNav active="responses" />
        <div className="f-dashboard-responses__heading">
          <h1 className="f-dashboard-responses__title">{list.title}</h1>
          <p className="f-dashboard-responses__subtitle">{list.subtitle}</p>
        </div>
        <div className="f-dashboard-responses__meta">
          <div className="f-dashboard-responses__meta-left">
            <p className="f-dashboard-responses__count" aria-live="polite">
              {list.resultCount(total)}
            </p>
            <p className="f-dashboard-responses__updated" aria-live="polite">
              {lastUpdatedAt
                ? list.lastUpdated(timeFormatter.format(lastUpdatedAt))
                : list.lastUpdatedNever}
            </p>
          </div>
          <div className="f-dashboard-responses__meta-actions">
            <CButton
              type="button"
              variant="ghost"
              fullWidth={false}
              disabled={checkedCount === 0 || deleting}
              className="f-dashboard-responses__delete"
              onClick={() => {
                setDeleteError(null);
                setConfirmDeleteOpen(true);
              }}
            >
              <span className="f-dashboard-responses__delete-inner">
                <Trash2 size={16} strokeWidth={1.75} aria-hidden />
                {checkedCount > 0
                  ? list.deleteSelectedCount(checkedCount)
                  : list.deleteSelected}
              </span>
            </CButton>
            <CButton
              type="button"
              variant="ghost"
              fullWidth={false}
              disabled={loading}
              className="f-dashboard-responses__refresh"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              <span className="f-dashboard-responses__refresh-inner">
                <RefreshCw size={16} strokeWidth={1.75} aria-hidden />
                {loading ? list.refreshing : list.refresh}
              </span>
            </CButton>
            <CButton
              type="button"
              variant="ghost"
              fullWidth={false}
              className="f-dashboard-responses__filters-trigger"
              onClick={() => setFiltersSheetOpen(true)}
            >
              <span className="f-dashboard-responses__filters-trigger-inner">
                <ListFilter size={16} strokeWidth={1.75} aria-hidden />
                {activeFilterCount > 0
                  ? list.filters.openSheetWithCount(activeFilterCount)
                  : list.filters.openSheet}
              </span>
            </CButton>
          </div>
        </div>
      </motion.header>

      <div
        ref={bodyRef}
        className={[
          "f-dashboard-responses__body",
          dragging ? "f-dashboard-responses__body--resizing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            "--dashboard-filters-width": `${widthPx}px`,
          } as CSSProperties
        }
      >
        <aside
          className="f-dashboard-responses__filters-pane"
          aria-label={list.filters.sectionLabel}
        >
          <DashboardFiltersForm idPrefix="desktop" {...filtersFormProps} />
        </aside>

        <button
          type="button"
          className="f-dashboard-responses__divider"
          aria-label={list.filters.resizeDivider}
          aria-orientation="vertical"
          aria-valuemin={minWidthPx}
          aria-valuemax={maxWidthPx}
          aria-valuenow={widthPx}
          onPointerDown={onDividerPointerDown}
          onKeyDown={onDividerKeyDown}
        />

        <section
          className="f-dashboard-responses__results-pane"
          aria-live="polite"
        >
          <div className="f-dashboard-responses__results">
            {loading ? (
              <div className="f-dashboard-responses__state">
                <CLoader label={t.common.loading} showLabel />
              </div>
            ) : null}

            {!loading && error ? (
              <div className="f-dashboard-responses__state">
                <p className="f-dashboard-responses__error">{error}</p>
                <CButton
                  type="button"
                  fullWidth={false}
                  onClick={() => setReloadKey((value) => value + 1)}
                >
                  {list.retry}
                </CButton>
              </div>
            ) : null}

            {!loading && !error && items.length === 0 ? (
              <div className="f-dashboard-responses__state">
                <p className="f-dashboard-responses__empty">{list.empty}</p>
              </div>
            ) : null}

            {!loading && !error && items.length > 0 ? (
              <>
                <div className="f-dashboard-responses__table-wrap">
                  <table className="f-dashboard-responses__table">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="f-dashboard-responses__check-col"
                        >
                          <span className="f-dashboard-responses__sr-only">
                            {list.columns.select}
                          </span>
                          <input
                            type="checkbox"
                            className="f-dashboard-responses__checkbox"
                            checked={allPageChecked}
                            ref={(element) => {
                              if (element) {
                                element.indeterminate = somePageChecked;
                              }
                            }}
                            aria-label={list.selectPage}
                            onChange={togglePageChecked}
                          />
                        </th>
                        <th scope="col">{list.columns.status}</th>
                        <th scope="col">{list.columns.name}</th>
                        <th scope="col">{list.columns.age}</th>
                        <th scope="col">{list.columns.contact}</th>
                        <th scope="col">{list.columns.work}</th>
                        <th scope="col">{list.columns.meeting}</th>
                        <th scope="col">{list.columns.gender}</th>
                        <th scope="col">{list.columns.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((response) => {
                        const isSelected = selected?.id === response.id;
                        const isChecked = checkedIds.has(response.id);

                        return (
                          <tr
                            key={response.id}
                            className={[
                              "f-dashboard-responses__row",
                              isSelected
                                ? "f-dashboard-responses__row--selected"
                                : "",
                              isChecked
                                ? "f-dashboard-responses__row--checked"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            tabIndex={0}
                            role="button"
                            aria-label={`${list.openDetail}: ${response.fullName ?? response.id}`}
                            onClick={() => setSelected(response)}
                            onKeyDown={(event) =>
                              handleRowKeyDown(event, response)
                            }
                          >
                            <td
                              className="f-dashboard-responses__check-col"
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                className="f-dashboard-responses__checkbox"
                                checked={isChecked}
                                aria-label={`${list.selectRow}: ${response.fullName ?? response.id}`}
                                onChange={() => toggleCheckedId(response.id)}
                              />
                            </td>
                            <td>
                              <span
                                className={[
                                  "f-dashboard-responses__status",
                                  `f-dashboard-responses__status--${response.status}`,
                                ].join(" ")}
                              >
                                {list.status[response.status]}
                              </span>
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={response.fullName ?? list.emptyCell}
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={
                                  response.ageGroup
                                    ? labels.ageGroups[response.ageGroup]
                                    : list.emptyCell
                                }
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={formatContact(response, list.emptyCell)}
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={
                                  response.workAreas.length > 0
                                    ? response.workAreas
                                        .map((area) => labels.workAreas[area])
                                        .join(" · ")
                                    : list.emptyCell
                                }
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={
                                  response.meetingSlots.length > 0
                                    ? response.meetingSlots
                                        .map((slot) => labels.meetingSlots[slot])
                                        .join(" · ")
                                    : list.emptyCell
                                }
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={
                                  response.gender
                                    ? labels.genders[response.gender]
                                    : list.emptyCell
                                }
                              />
                            </td>
                            <td>
                              <DashboardTruncatedCell
                                value={formatDate(response, list.emptyCell)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 ? (
                  <div className="f-dashboard-responses__pagination">
                    <CButton
                      type="button"
                      variant="ghost"
                      fullWidth={false}
                      disabled={filters.page <= 1}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          page: Math.max(1, current.page - 1),
                        }))
                      }
                    >
                      {list.pagination.previous}
                    </CButton>
                    <p className="f-dashboard-responses__page-label">
                      {list.pagination.page(filters.page, totalPages)}
                    </p>
                    <CButton
                      type="button"
                      variant="ghost"
                      fullWidth={false}
                      disabled={filters.page >= totalPages}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          page: Math.min(totalPages, current.page + 1),
                        }))
                      }
                    >
                      {list.pagination.next}
                    </CButton>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
      </div>

      <DashboardFiltersSheet
        open={filtersSheetOpen}
        onClose={closeFiltersSheet}
      >
        <DashboardFiltersForm idPrefix="mobile" {...filtersFormProps} />
      </DashboardFiltersSheet>

      <DashboardResponseDetailPanel
        response={selected}
        onClose={closeDetail}
      />

      <DashboardConfirmDialog
        open={confirmDeleteOpen}
        title={list.deleteConfirm.title}
        body={list.deleteConfirm.body(checkedCount)}
        cancelLabel={list.deleteConfirm.cancel}
        confirmLabel={list.deleteConfirm.confirm}
        confirmingLabel={list.deleteConfirm.confirming}
        confirming={deleting}
        error={deleteError}
        onCancel={closeConfirmDelete}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
