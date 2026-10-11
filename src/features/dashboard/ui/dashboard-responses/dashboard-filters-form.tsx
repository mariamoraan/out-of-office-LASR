"use client";

import {
  AGE_GROUPS,
  GENDERS,
  MEETING_SLOTS,
  WORK_AREAS,
} from "@/core/constants/survey.constants";
import { getDictionary } from "@/core/i18n";
import {
  hasActiveFilters,
  toggleFilterValue,
  type FilterState,
} from "@/features/dashboard/ui/dashboard-responses/dashboard-filter-state";
import { CButton, CChip, CChipGroup, CInput } from "@/design-system";

type DashboardFiltersFormProps = {
  filters: FilterState;
  idPrefix: string;
  onSearchChange: (value: string) => void;
  onPatch: (
    patch:
      | Partial<Omit<FilterState, "page">>
      | ((current: FilterState) => Partial<Omit<FilterState, "page">>),
  ) => void;
  onClear: () => void;
};

export function DashboardFiltersForm({
  filters,
  idPrefix,
  onSearchChange,
  onPatch,
  onClear,
}: DashboardFiltersFormProps) {
  const t = getDictionary("es");
  const list = t.dashboard.list;
  const labels = t.survey.labels;
  const showClear = hasActiveFilters(filters);

  return (
    <div className="f-dashboard-responses__filters">
      <CInput
        id={`${idPrefix}-dashboard-search`}
        label={list.filters.searchLabel}
        placeholder={list.filters.searchPlaceholder}
        value={filters.search}
        onChange={onSearchChange}
        autoComplete="off"
      />

      <div className="f-dashboard-responses__filter-group">
        <p className="f-dashboard-responses__filter-label">
          {list.filters.statusLabel}
        </p>
        <CChipGroup>
          <CChip
            label={list.filters.statusAll}
            selected={filters.status === null}
            onClick={() => onPatch({ status: null })}
          />
          <CChip
            label={list.filters.statusDraft}
            selected={filters.status === "draft"}
            onClick={() => onPatch({ status: "draft" })}
          />
          <CChip
            label={list.filters.statusSubmitted}
            selected={filters.status === "submitted"}
            onClick={() => onPatch({ status: "submitted" })}
          />
        </CChipGroup>
      </div>

      <div className="f-dashboard-responses__filter-group">
        <p className="f-dashboard-responses__filter-label">
          {list.filters.ageLabel}
        </p>
        <CChipGroup>
          {AGE_GROUPS.map((ageGroup) => (
            <CChip
              key={ageGroup}
              label={labels.ageGroups[ageGroup]}
              selection="checkbox"
              selected={filters.ageGroups.includes(ageGroup)}
              onClick={() =>
                onPatch((current) => ({
                  ageGroups: toggleFilterValue(current.ageGroups, ageGroup),
                }))
              }
            />
          ))}
        </CChipGroup>
      </div>

      <div className="f-dashboard-responses__filter-group">
        <p className="f-dashboard-responses__filter-label">
          {list.filters.workLabel}
        </p>
        <CChipGroup>
          {WORK_AREAS.map((workArea) => (
            <CChip
              key={workArea}
              label={labels.workAreas[workArea]}
              selection="checkbox"
              selected={filters.workAreas.includes(workArea)}
              onClick={() =>
                onPatch((current) => ({
                  workAreas: toggleFilterValue(current.workAreas, workArea),
                }))
              }
            />
          ))}
        </CChipGroup>
      </div>

      <div className="f-dashboard-responses__filter-group">
        <p className="f-dashboard-responses__filter-label">
          {list.filters.meetingLabel}
        </p>
        <CChipGroup>
          {MEETING_SLOTS.map((slot) => (
            <CChip
              key={slot}
              label={labels.meetingSlots[slot]}
              selection="checkbox"
              selected={filters.meetingSlots.includes(slot)}
              onClick={() =>
                onPatch((current) => ({
                  meetingSlots: toggleFilterValue(current.meetingSlots, slot),
                }))
              }
            />
          ))}
        </CChipGroup>
      </div>

      <div className="f-dashboard-responses__filter-group">
        <p className="f-dashboard-responses__filter-label">
          {list.filters.genderLabel}
        </p>
        <CChipGroup>
          {GENDERS.map((gender) => (
            <CChip
              key={gender}
              label={labels.genders[gender]}
              selection="checkbox"
              selected={filters.genders.includes(gender)}
              onClick={() =>
                onPatch((current) => ({
                  genders: toggleFilterValue(current.genders, gender),
                }))
              }
            />
          ))}
        </CChipGroup>
      </div>

      {showClear ? (
        <div className="f-dashboard-responses__filter-actions">
          <CButton type="button" variant="ghost" fullWidth={false} onClick={onClear}>
            {list.clearFilters}
          </CButton>
        </div>
      ) : null}
    </div>
  );
}
