Page({
  data: {
    userId: '',
    todayBookings: []
  },

  onLoad(options) {
    const userId = decodeURIComponent(options.userId || '')
    const allBookings = wx.getStorageSync('allBookings') || []
    const today = new Date().toISOString().slice(0, 10)
    const todayBookings = allBookings.filter(b => b.userId === userId && b.date === today)

    this.setData({ todayBookings, userId })
  },

  checkIn(e) {
    const bookingId = e.currentTarget.dataset.id
    const allBookings = wx.getStorageSync('allBookings') || []
    const index = allBookings.findIndex(b => b.bookingId === bookingId)

    if (index !== -1) {
      allBookings[index].checkedIn = true
      wx.setStorageSync('allBookings', allBookings)
      wx.showToast({ title: '签到成功', icon: 'success' })
      this.onLoad({ userId: this.data.userId }) // 刷新
    }
  }
})