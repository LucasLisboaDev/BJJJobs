"use client";

import { useLanguage } from "@/components/language-provider";
import type { CoachLocationInput, CoachLocationType } from "@/lib/coach-location";
import { US_STATES } from "@/lib/utils";

export function CoachLocationFields({
  value,
  onChange,
}: {
  value: CoachLocationInput;
  onChange: (value: CoachLocationInput) => void;
}) {
  const { t } = useLanguage();

  function setLocationType(locationType: CoachLocationType) {
    onChange({
      ...value,
      locationType,
      country: locationType === "US" ? "" : value.country,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">{t("dashboard.locationTypeQuestion")}</label>
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            onClick={() => setLocationType("US")}
            className={`chip-toggle text-sm ${value.locationType === "US" ? "chip-toggle-active" : ""}`}
          >
            {t("dashboard.locationInUS")}
          </button>
          <button
            type="button"
            onClick={() => setLocationType("INTERNATIONAL")}
            className={`chip-toggle text-sm ${
              value.locationType === "INTERNATIONAL" ? "chip-toggle-active" : ""
            }`}
          >
            {t("dashboard.locationOutsideUS")}
          </button>
        </div>
      </div>

      {value.locationType === "US" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label text-label-tertiary">{t("dashboard.city")}</label>
            <input
              className="ios-field w-full"
              placeholder="Miami"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label text-label-tertiary">{t("dashboard.state")}</label>
            <select
              className="ios-field w-full"
              value={value.state}
              onChange={(e) => onChange({ ...value, state: e.target.value })}
            >
              <option value="">{t("dashboard.selectState")}</option>
              {US_STATES.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label text-label-tertiary">{t("dashboard.city")}</label>
            <input
              className="ios-field w-full"
              placeholder="São Paulo"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label text-label-tertiary">{t("dashboard.stateProvince")}</label>
            <input
              className="ios-field w-full"
              placeholder="SP"
              value={value.state}
              onChange={(e) => onChange({ ...value, state: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label text-label-tertiary">{t("dashboard.country")}</label>
            <input
              className="ios-field w-full"
              placeholder="Brazil"
              value={value.country}
              onChange={(e) => onChange({ ...value, country: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
