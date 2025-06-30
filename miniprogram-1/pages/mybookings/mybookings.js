Page({
  data: {
    myBookings: [],
    userId: ''
  },

  onLoad(options) {
    const userId = decodeURIComponent(options.userId || '')
    const allBookings = wx.getStorageSync('allBookings') || []
    const myBookings = allBookings.filter(b => b.userId === userId)

    this.setData({ myBookings, userId })
  },

  cancelBooking(e) {
    const bookingId = e.currentTarget.dataset.id
    const allBookings = wx.getStorageSync('allBookings') || []
    const userStats = wx.getStorageSync('userStats') || {}
    const booking = allBookings.find(b => b.bookingId === bookingId)
    const userId = booking.userId
    const today = new Date().toISOString().slice(0, 10)
    const thisMonth = today.slice(0, 7)

    if (!userStats[userId]) {
      userStats[userId] = { cancelHistory: [], missedCount: 0, bannedUntil: '' }
    }

    // 检查本月取消次数
    const monthlyCancels = userStats[userId].cancelHistory.filter(d => d.startsWith(thisMonth))
    if (monthlyCancels.length >= 5) {
      wx.showToast({ title: '本月取消已达上限', icon: 'none' })
      return
    }

    // 更新用户取消记录
    userStats[userId].cancelHistory.push(today)
    wx.setStorageSync('userStats', userStats)

    // 删除预约记录
    const updatedBookings = allBookings.filter(b => b.bookingId !== bookingId)
    wx.setStorageSync('allBookings', updatedBookings)

    // 刷新页面数据
    const myBookings = updatedBookings.filter(b => b.userId === userId)
    this.setData({ myBookings })

    wx.showToast({ title: '取消成功', icon: 'success' })
  }
})