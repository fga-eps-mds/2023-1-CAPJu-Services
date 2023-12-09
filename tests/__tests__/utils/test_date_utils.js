import { formatDateTimeToBrazilian } from "../../../src/utils/date";

describe('Format Date Time Brazilian', () => {
  it("check if return date correctly", () => {
    const now = new Date()
    const result = formatDateTimeToBrazilian(now);

    expect(result).toContain(now.getDate().toString())
    expect(result).toContain((now.getMonth() + 1).toString())
    expect(result).toContain(now.getFullYear().toString())
  })
})