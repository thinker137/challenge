Page({
  data: {
    missedUsers: []
  },

  onLoad() {
    const userStats = wx.getStorageSync('userStats') || {}
    const missedUsers = []

    for (let uid in userStats) {
      const data = userStats[uid]
      if (data.missedCount > 0) {
        missedUsers.push({
          userId: uid,
          nickName: '', // 可根据预约记录取最新昵称
          missedCount: data.missedCount,
          bannedUntil: data.bannedUntil || ''
        })
      }
    }

    this.setData({ missedUsers })
  }
})