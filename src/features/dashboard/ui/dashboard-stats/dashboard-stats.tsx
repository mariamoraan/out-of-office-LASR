"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { TEXT_INPUT_DEBOUNCE_MS } from "@/core/constants/app.constants";
import { getDictionary } from "@/core/i18n";
import { ListFilter, LogOut, RefreshCw } from "@/core/icons";
import { appRoutes } from "@/core/routes/app.routes";
import {
  ADMIN_SURVEY_STATS_DEFAULT_DIMENSION,
  ADMIN_SURVEY_STATS_DIMENSIONS,
  type AdminSurveyStatsBucket,
  type AdminSurveyStatsDimension,
  type AdminSurveyStatsResult,
} from "@/features/dashboard/domain/admin-survey-stats";
import {
  fetchAdminSurveyStats,
  logoutAdminRequest,
  type AdminSurveyStatsQuery,
} from "@/features/dashboard/ui/dashboard-api-client";
import { DashboardFiltersSheet } from "@/features/dashboard/ui/dashboard-filters-sheet/dashboard-filters-sheet";
import { DashboardNav } from "@/features/dashboard/ui/dashboard-nav/dashboard-nav";
import {
  countActiveFilters,
  INITIAL_FILTERS,
  type FilterState,
} from "@/features/dashboard/ui/dashboard-responses/dashboard-filter-state";
import { DashboardFiltersForm } from "@/features/dashboard/ui/dashboard-responses/dashboard-filters-form";
import { useDashboardSplitWidth } from "@/features/dashboard/ui/dashboard-responses/use-dashboard-split-width";
import { CButton, CChip, CChipGroup, CLoader } from "@/design-system";

import "./dashboard-stats.scss";

const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
});

function bucketLabel(
  dimension: AdminSurveyStatsDimension,
  key: string,
  labels: ReturnType<typeof getDictionary>["survey"]["labels"],
): string {
  switch (dimension) {
    case "ageGroup":
      return labels.ageGroups[key as keyof typeof labels.ageGroups] ?? key;
    case "gender":
      return labels.genders[key as keyof typeof labels.genders] ?? key;
    case "workAreas":
      return labels.workAreas[key as keyof typeof labels.workAreas] ?? key;
    case "meetingSlots":
      return (
        labels.meetingSlots[key as keyof typeof labels.meetingSlots] ?? key
      );
    case "leisureTags":
      return labels.leisure[key as keyof typeof labels.leisure] ?? key;
  }
}

function BarChart({
  dimension,
  buckets,
  labels,
  chartAriaLabel,
}: {
  dimension: AdminSurveyStatsDimension;
  buckets: AdminSurveyStatsBucket[];
  labels: ReturnType<typeof getDictionary>["survey"]["labels"];
  chartAriaLabel: string;
}) {
  const maxCount = Math.max(0, ...buckets.map((bucket) => bucket.count));

  return (
    <ul className="f-dashboard-stats__chart" aria-label={chartAriaLabel}>
      {buckets.map((bucket) => {
        const percent =
          maxCount > 0 ? Math.round((bucket.count / maxCount) * 100) : 0;
        const label = bucketLabel(dimension, bucket.key, labels);

        return (
          <li key={bucket.key} className="f-dashboard-stats__bar-row">
            <div className="f-dashboard-stats__bar-label">
              <span className="f-dashboard-stats__bar-name">{label}</span>
              <span className="f-dashboard-stats__bar-count">
                {bucket.count}
              </span>
            </div>
            <div
              className="f-dashboard-stats__bar-track"
              role="img"
              aria-label={`${label}: ${bucket.count}`}
            >
              <div
                className="f-dashboard-stats__bar-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardStats() {
  const t = getDictionary("es");
  const stats = t.dashboard.stats;
  const listFilters = t.dashboard.list.filters;
  const labels = t.survey.labels;
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dimension, setDimension] = useState<AdminSurveyStatsDimension>(
    ADMIN_SURVEY_STATS_DEFAULT_DIMENSION,
  );
  const [result, setResult] = useState<AdminSurveyStatsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
  const closeFiltersSheet = useCallback(() => setFiltersSheetOpen(false), []);
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

  const query = useMemo<AdminSurveyStatsQuery>(
    () => ({
      dimension,
      status: filters.status ?? undefined,
      ageGroups: filters.ageGroups,
      workAreas: filters.workAreas,
      meetingSlots: filters.meetingSlots,
      genders: filters.genders,
      search: debouncedSearch,
    }),
    [
      debouncedSearch,
      dimension,
      filters.ageGroups,
      filters.genders,
      filters.meetingSlots,
      filters.status,
      filters.workAreas,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchAdminSurveyStats(query, controller.signal)
      .then((payload) => {
        setResult(payload);
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

        setResult(null);
        setError(stats.loadError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [query, reloadKey, stats.loadError]);

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

  const activeFilterCount = countActiveFilters(filters);

  function patchFilters(
    patch:
      | Partial<Omit<FilterState, "page">>
      | ((current: FilterState) => Partial<Omit<FilterState, "page">>),
  ) {
    setFilters((current) => {
      const nextPatch = typeof patch === "function" ? patch(current) : patch;
      return { ...current, ...nextPatch, page: 1 };
    });
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutAdminRequest();
      router.replace(appRoutes.dashboardLogin);
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const filtersFormProps = {
    filters,
    onSearchChange: (value: string) =>
      setFilters((current) => ({ ...current, search: value })),
    onPatch: patchFilters,
    onClear: () => setFilters(INITIAL_FILTERS),
  };

  const totalResponses = result?.totalResponses ?? 0;
  const showEmpty = !loading && !error && totalResponses === 0;
  const showChart = !loading && !error && result && totalResponses > 0;

  return (
    <main className="f-dashboard-stats">
      <motion.header
        className="f-dashboard-stats__header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <div className="f-dashboard-stats__top">
          <p className="f-dashboard-stats__brand">{t.appName}</p>
          <CButton
            type="button"
            variant="ghost"
            fullWidth={false}
            disabled={loggingOut}
            className="f-dashboard-stats__logout"
            onClick={handleLogout}
          >
            <span className="f-dashboard-stats__logout-inner">
              <LogOut size={16} strokeWidth={1.75} aria-hidden />
              {loggingOut ? t.dashboard.loggingOut : t.dashboard.logout}
            </span>
          </CButton>
        </div>
        <DashboardNav active="stats" />
        <div className="f-dashboard-stats__heading">
          <h1 className="f-dashboard-stats__title">{stats.title}</h1>
          <p className="f-dashboard-stats__subtitle">{stats.subtitle}</p>
        </div>
        <div className="f-dashboard-stats__meta">
          <div className="f-dashboard-stats__meta-left">
            <p className="f-dashboard-stats__count" aria-live="polite">
              {stats.responseCount(totalResponses)}
            </p>
            <p className="f-dashboard-stats__updated" aria-live="polite">
              {lastUpdatedAt
                ? stats.lastUpdated(timeFormatter.format(lastUpdatedAt))
                : stats.lastUpdatedNever}
            </p>
          </div>
          <div className="f-dashboard-stats__meta-actions">
            <CButton
              type="button"
              variant="ghost"
              fullWidth={false}
              disabled={loading}
              className="f-dashboard-stats__refresh"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              <span className="f-dashboard-stats__refresh-inner">
                <RefreshCw size={16} strokeWidth={1.75} aria-hidden />
                {loading ? stats.refreshing : stats.refresh}
              </span>
            </CButton>
            <CButton
              type="button"
              variant="ghost"
              fullWidth={false}
              className="f-dashboard-stats__filters-trigger"
              onClick={() => setFiltersSheetOpen(true)}
            >
              <span className="f-dashboard-stats__filters-trigger-inner">
                <ListFilter size={16} strokeWidth={1.75} aria-hidden />
                {activeFilterCount > 0
                  ? stats.filters.openSheetWithCount(activeFilterCount)
                  : stats.filters.openSheet}
              </span>
            </CButton>
          </div>
        </div>
      </motion.header>

      <div
        ref={bodyRef}
        className={[
          "f-dashboard-stats__body",
          dragging ? "f-dashboard-stats__body--resizing" : "",
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
          className="f-dashboard-stats__filters-pane"
          aria-label={stats.filters.sectionLabel}
        >
          <DashboardFiltersForm idPrefix="stats-desktop" {...filtersFormProps} />
        </aside>

        <button
          type="button"
          className="f-dashboard-stats__divider"
          aria-label={listFilters.resizeDivider}
          aria-orientation="vertical"
          aria-valuemin={minWidthPx}
          aria-valuemax={maxWidthPx}
          aria-valuenow={widthPx}
          onPointerDown={onDividerPointerDown}
          onKeyDown={onDividerKeyDown}
        />

        <section className="f-dashboard-stats__results-pane" aria-live="polite">
          <div className="f-dashboard-stats__results">
            <div className="f-dashboard-stats__dimension">
              <p
                id="dashboard-stats-dimension-label"
                className="f-dashboard-stats__dimension-label"
              >
                {stats.dimensionLabel}
              </p>
              <CChipGroup>
                {ADMIN_SURVEY_STATS_DIMENSIONS.map((value) => (
                  <CChip
                    key={value}
                    label={stats.dimensions[value]}
                    selected={dimension === value}
                    onClick={() => setDimension(value)}
                  />
                ))}
              </CChipGroup>
            </div>

            {loading ? (
              <div className="f-dashboard-stats__state">
                <CLoader label={t.common.loading} showLabel />
              </div>
            ) : null}

            {!loading && error ? (
              <div className="f-dashboard-stats__state">
                <p className="f-dashboard-stats__error">{error}</p>
                <CButton
                  type="button"
                  fullWidth={false}
                  onClick={() => setReloadKey((value) => value + 1)}
                >
                  {stats.retry}
                </CButton>
              </div>
            ) : null}

            {showEmpty ? (
              <div className="f-dashboard-stats__state">
                <p className="f-dashboard-stats__empty">{stats.empty}</p>
              </div>
            ) : null}

            {showChart && result ? (
              <BarChart
                dimension={result.dimension}
                buckets={result.buckets}
                labels={labels}
                chartAriaLabel={stats.chartAriaLabel}
              />
            ) : null}
          </div>
        </section>
      </div>

      <DashboardFiltersSheet
        open={filtersSheetOpen}
        onClose={closeFiltersSheet}
      >
        <DashboardFiltersForm idPrefix="stats-sheet" {...filtersFormProps} />
      </DashboardFiltersSheet>
    </main>
  );
}
