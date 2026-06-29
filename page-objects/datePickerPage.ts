import {Page, expect} from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatePickerPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberofDaysFromToday: number) {
        const calenderInput = this.page.getByPlaceholder('Form Picker')
        await calenderInput.click()
        const dateToAssert = await this.selectDateIntheCalendar(numberofDaysFromToday)
        await expect(calenderInput).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDate: number, endDate: number){
         const calenderInput = this.page.getByPlaceholder('Range Picker')
        await calenderInput.click()
        const dateToAssertStart = await this.selectDateIntheCalendar(startDate)
        const dateToAssertEnd = await this.selectDateIntheCalendar(endDate)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calenderInput).toHaveValue(dateToAssert)
    }

    private async selectDateIntheCalendar(numberofDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberofDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }      
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).last().click()
        //await page.locator('.day-cell').getByText(expectedDate, {exact: true}).click()
        return dateToAssert
    }
}