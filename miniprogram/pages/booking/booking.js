Page({
  data: {
    busList: ['1号线', '2号线', '5号线', '网安校巴'],
    selectedBus: '',
    date: '',
    time: '08:00',
    bookingSuccess: false,
    bookingId: '',
    userId: '',
    nickName: '',
    role: ''
  },

  onLoad(options) {
    this.setData({
      userId: decodeURIComponent(options.userId || ''),
      nickName: decodeURIComponent(options.nickName || ''),
      role: decodeURIComponent(options.role || '')
    })
  },

  onBusChange(e) {
    const selected = this.data.busList[e.detail.value]
    this.setData({ selectedBus: selected })
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value })
  },

  onTimeChange(e) {
    this.setData({ time: e.detail.value })
  },
  
  submitBooking() {
    const { selectedBus, date, time, userId, nickName } = this.data

    if (!selectedBus || !date || !time) {
      wx.showToast({
        title: '请填写完整预约信息',
        icon: 'none'
      })
      return
    }

    const allBookings = wx.getStorageSync('allBookings') || []

    const hasBooked = allBookings.some(item => item.userId === userId && item.date === date)

    if (hasBooked) {
      wx.showToast({
        title: '你今天已预约过',
        icon: 'none'
      })
      return
    }

    const randomId = 'R' + Math.floor(1000 + Math.random() * 9000)

    const newBooking = {
      userId,
      nickName,
      bus: selectedBus,
      date,
      time,
      bookingId: randomId
    }

    allBookings.push(newBooking)
    wx.setStorageSync('allBookings', allBookings)

    this.setData({
      bookingSuccess: true,
      bookingId: randomId
    })

    wx.showToast({
      title: '预约成功',
      icon: 'success'
    })
  },

  goToMyBookings() {
    wx.navigateTo({
      url: `/pages/mybookings/mybookings?userId=${encodeURIComponent(this.data.userId)}`
    })
  }
})