-- Convert leisure_other from nullable text to text[] (preserve existing values).
ALTER TABLE "survey_responses"
  ALTER COLUMN "leisure_other" DROP DEFAULT;

ALTER TABLE "survey_responses"
  ALTER COLUMN "leisure_other" TYPE TEXT[] USING (
    CASE
      WHEN "leisure_other" IS NULL THEN ARRAY[]::TEXT[]
      ELSE ARRAY["leisure_other"]::TEXT[]
    END
  );

ALTER TABLE "survey_responses"
  ALTER COLUMN "leisure_other" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "leisure_other" SET NOT NULL;
