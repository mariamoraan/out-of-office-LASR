export interface AdminSurveyWriteRepository {
  deleteByIds(ids: string[]): Promise<number>;
}
