/****类定义开始*/

class festivalRemind {

    constructor() {
        /*基本节日信息
            hName: 节日名称
            fixed: 节日日期是否固定，不固定为false,固定为具体的日期,这项有具体的值，ordinal 和 week全部设为false
            ordinal + week: 第几个星期几，这两项有值时，fixed设为false
                ordinal:第几个星期几中的前者，如5月的第2个星期4，ordinal写2，如果是5月的最后1个星期1，ordinal写-1
                week:第几个星期几中的后者，如5月的第2个星期4，那么week就写4
            hInfo: 节日描述信息
        */
        this.basicFestivalData = [
            [
                { hName: "New Year's Day", fixed: 1, ordinal: false, week: false, hInfo: "" },
                { hName: "Martin Luther King Day", fixed: false, ordinal: 3, week: 1, hInfo: "" },
                { hName: "Australia Day", fixed: 26, ordinal: false, week: false, hInfo: "" },
            ],
            [
                { hName: "Valentine's Day", fixed: 14, ordinal: false, week: false, hInfo: "" },
                { hName: "President's Day", fixed: false, ordinal: 3, week: 1, hInfo: "" },
            ],
            [
                { hName: "Women's Day", fixed: 8, ordinal: false, week: false, hInfo: "" },
                { hName: "Pi Day", fixed: 14, ordinal: false, week: false, hInfo: "" },
                { hName: "St. Patrick's Day", fixed: 17, ordinal: false, week: false, hInfo: "" },
                { hName: "World Water Day", fixed: 22, ordinal: false, week: false, hInfo: "" },
            ],
            [
                { hName: "April Fool's Day", fixed: 1, ordinal: false, week: false, hInfo: "" },
                { hName: "Tax Day", fixed: 15, ordinal: false, week: false, hInfo: "" },
                { hName: "Earth Day", fixed: 22, ordinal: false, week: false, hInfo: "" },
                { hName: "Anzac Day", fixed: 25, ordinal: false, week: false, hInfo: "" },
            ],
            [
                { hName: "May Day", fixed: 1, ordinal: false, week: false, hInfo: "" },
                { hName: "Nurse Day", fixed: 12, ordinal: false, week: false, hInfo: "" },
                { hName: "Mother's Day", fixed: false, ordinal: 2, week: 0, hInfo: "" },
                { hName: "Memorial Day", fixed: false, ordinal: -1, week: 1, hInfo: "" },
            ],
            [
                { hName: "Father's Day", fixed: false, ordinal: 3, week: 0, hInfo: "" },
            ],
            [
                { hName: "Canada Day", fixed: 1, ordinal: false, week: false, hInfo: "" },
                { hName: "Independence Day", fixed: 4, ordinal: false, week: false, hInfo: "" },
            ],
            [

            ],
            [
                { hName: "Labor Day", fixed: false, ordinal: 1, week: 1, hInfo: "" },
                { hName: "Father's Day", fixed: false, ordinal: 1, week: 1, hInfo: "" },
            ],
            [
                { hName: "Columbus Day", fixed: false, ordinal: 2, week: 1, hInfo: "" },
                { hName: "Seniors Day", fixed: 1, ordinal: false, week: false, hInfo: "" },
                { hName: "Halloween", fixed: 31, ordinal: false, week: false, hInfo: "" },
            ],
            [
                { hName: "Election Day", fixed: 2, ordinal: false, week: false, hInfo: "" },
                { hName: "Veterans Day", fixed: 11, ordinal: false, week: false, hInfo: "" },
                { hName: "Thanksgiving Day", fixed: false, ordinal: 4, week: 4, hInfo: "" },
            ],
            [
                { hName: "Christmas", fixed: 25, ordinal: false, week: false, hInfo: "" },
                { hName: "Boxing Day", fixed: 26, ordinal: false, week: false, hInfo: "" },
            ]
        ];


        let oDate = new Date(); //当前日期对象
        this.currentTime = oDate.getTime();//当前时间戳
        this.currentYear = oDate.getFullYear();//当前年份
        this.currentMonth = oDate.getMonth();//当前月份
        this.currentDate = oDate.getDate();//当前多少号
        this.nextMonthFirstDay = new Date(this.currentYear, this.currentMonth + 1, 1).getTime();//下个月1号时间戳
        this.currentMonthArr = this.basicFestivalData[this.currentMonth];//当前月份节日数组
        this.daysBeforeFestival = 14; //节日之前多少天需要提醒，可修改
        this.daysAfterFestival = 3; //节日之后需要提醒多少天，可修改
        this.preMonthArr = [];   //上一个月节日数组
        this.nextMonthArr = [];  //下一个月节日数组
        this.finalFestivalData = []; //最终供DOM使用的节日数组

        this.easterInfo = { hName: "Easter", hMonth: 4, hDay: 1, hInfo: "" };//Easter算法比较复杂,而且会影响UK母亲节和Good Friday的具体日期,每年单独手动设置一次即可，后续再找其他方案

        this.handleEasterRelated();

    }


    /**
     * [getSpecificDate 根据几月的第几个星期几算出节日具体是多少号]
     * @param  {Number} month   [月份0-11]
     * @param  {Number} ordinal [第几个星期1-5]
     * @param  {Number} week    [星期几0-6]
     * @return {Number}         [返回具体的日期(多少号)]
     */
    getSpecificDate(month = 0, ordinal = 1, week = 0) {
        if (month > 11 || week > 6) return;
        let firstDayObj = new Date(this.currentYear, month, 1);//某月1号日期对象
        let lastDayTimestamp = new Date(this.currentYear, month + 1, 1).getTime() - 86400000;//某月最后一天时间戳
        let lastDayObj = new Date(lastDayTimestamp);//某月最后一天日期对象
        let firstDay = firstDayObj.getDay();//某月1号星期几
        let lastDay = lastDayObj.getDay();//某月最后一天星期几
        let lastDayDate = lastDayObj.getDate();//某月最后一天多少号
        let specificDate = 0;
        if (ordinal < 0) {
            if (ordinal < -5) return;
            if (lastDay > week) {
                specificDate = lastDayDate - (lastDay - week) - (-ordinal - 1) * 7;
            }
            else {
                specificDate = lastDayDate - (7 - (week - lastDay)) - (-ordinal - 1) * 7;
            }
        }
        else {
            if (ordinal > 5) return;
            if (firstDay > week) {
                specificDate = 8 - (firstDay - week) + (ordinal - 1) * 7;
            }
            else {
                specificDate = (week - firstDay + 1) + (ordinal - 1) * 7;
            }
        }

        return specificDate;
    }

    /**
     * [ShouldRemindThisMonth 根据传入的节日日期，判断本月是否应该显示某节日]
     * @param  {Number}  festivalDay [节日日期]
     * @param  {Number}  month      [月份]
     * @param  {String}  hName      [节日名称]
     */
    ShouldRemindThisMonth(festivalDay = 0, month = 0, hName = '') {
        if (festivalDay > 31 || festivalDay < 1) return;
        let festivalTime = new Date(this.currentYear, month, festivalDay).getTime();
        let startTime = festivalTime - (this.daysBeforeFestival + 1) * 86400000;
        let endTime = festivalTime + (this.daysAfterFestival + 1) * 86400000;
        if (this.currentTime > startTime && this.currentTime < endTime) {
            let tmpobj = {};
            tmpobj.hName = hName;
            tmpobj.hInfo = `${month + 1}月${festivalDay}号`;
            this.finalFestivalData.push(tmpobj);
        }
    }

    /**
     * [getFinalFestivalArr 遍历传入的数组，组织好数据结构，并压人最终的节日信息数组]
     * @param  {Array}  arr   [要遍历的数组]
     * @param  {Number} month [要处理的月份]
     * @return {undefined}    [无返回值]
     */
    getFinalFestivalArr(arr = [], month = 0) {
        if (month < 0 || month > 11) return;
        arr.forEach((v) => {
            if (v.fixed === false) {
                let { ordinal, week } = v;
                let festivalDay = this.getSpecificDate(month, ordinal, week);
                this.ShouldRemindThisMonth(festivalDay, month, v.hName);
            }
            else {
                this.ShouldRemindThisMonth(v.fixed, month, v.hName);
            }
        });
    }

    /**
     * [check 根据当前日期，确定是否检查前一个月或者下一个月]
     */
    check() {
        //如果当前这一天处于节日后提醒天数之前就检查上一个月
        if (this.currentDate < (this.daysAfterFestival + 1)) {
            this.preMonthArr = this.basicFestivalData[this.currentMonth - 1];
            this.getFinalFestivalArr(this.preMonthArr, this.currentMonth - 1);
        }
        this.getFinalFestivalArr(this.currentMonthArr, this.currentMonth);
        //如果当前这一天 + 节日前提醒时间  已经超过了下个月1号就检查下个月
        if ((this.currentTime + 86400000 * this.daysBeforeFestival) > this.nextMonthFirstDay) {
            this.nextMonthArr = this.basicFestivalData[this.currentMonth + 1];
            this.getFinalFestivalArr(this.nextMonthArr, this.currentMonth + 1);
        }
    }

    /**
     * [handleEasterRelated 根据手动指定的Easter节日信息，填充Easter、UK Mother's Day、Good Friday信息到basicFestivalData中]
     */
    handleEasterRelated() {
        //处理Easter
        let { hMonth, hDay } = this.easterInfo;
        let tmpEasterObj = { hName: "Easter", fixed: hDay, ordinal: false, week: false, hInfo: "" };
        this.basicFestivalData[hMonth - 1].push(tmpEasterObj);

        let eastertime = new Date(this.currentYear, hMonth - 1, hDay).getTime();
        //处理UK Mother's Day
        this.fillBasicFestivalData(eastertime - 21 * 86400000, "UK Mother's Day");
        //处理Good Friday
        this.fillBasicFestivalData(eastertime - 2 * 86400000, "Good Friday");
    }

    /**
     * [fillBasicFestivalData 填充特殊节日信息到基本节日数组中]
     * @param  {Number} timestamp [节日时间戳]
     * @param  {String} hName     [节日名称]
     */
    fillBasicFestivalData(timestamp = 0, hName = '') {
        let dateObj = new Date(timestamp);
        let hObj = { hName, fixed: dateObj.getDate(), ordinal: false, week: false, hInfo: "" };
        this.basicFestivalData[dateObj.getMonth()].push(hObj);
    }

    /**
     * [render 将得到的节日信息渲染到DOM中]
     */
    render() {
        this.check();
        if (this.finalFestivalData.length === 0) return;
        let oTitle = document.querySelector('#title');
        let oTable = (oTitle.parentElement.parentElement.parentElement);
        let oTr = document.createElement('tr');
        oTr.innerHTML = '<td class="td_label">Festival Prefix</td><td class="td_value"></td>';
        oTable.insertBefore(oTr, oTable.children[10]);
        let isAnyoneClicked = false;
        for (let i = 0, len = this.finalFestivalData.length; i < len; i++) {
            let oInput = document.createElement('input');
            oInput.value = this.finalFestivalData[i].hName;
            oInput.setAttribute('title', this.finalFestivalData[i].hInfo);
            oInput.type = 'button';
            oInput.style.marginRight = '8px';
            oInput.addEventListener('click', function () {
                let originalVal = oTitle.value;
                if (originalVal.includes(this.value)) return;
                oTitle.value = isAnyoneClicked ? `${this.value} - ${originalVal.substring(originalVal.indexOf('-') + 2)}` : `${this.value} - ${originalVal}`;
                if (originalVal === '') {
                    oTitle.focus();
                }
                isAnyoneClicked = true;
            });
            oTr.children[1].appendChild(oInput);
        }
    }

}


/***类定义结束***/

let fr = new festivalRemind();
fr.render();
