Page({
  data: {
    busList: [
      { id: 1, name: '1号线' },
      { id: 2, name: '2号线' },
      { id: 3, name: '5号线' },
      { id: 4, name: '网安校巴' }
    ],
    newBusName: ''
  },

  onInputBusName(e) {
    this.setData({ newBusName: e.detail.value });
  },

  addBus() {
    const { newBusName, busList } = this.data;
    if (!newBusName.trim()) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      });
      return;
    }

    const newId = busList.length > 0 ? busList[busList.length - 1].id + 1 : 1;
    const newList = [...busList, { id: newId, name: newBusName }];

    this.setData({
      busList: newList,
      newBusName: ''
    });

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  deleteBus(e) {
    const busId = e.currentTarget.dataset.id;
    const newList = this.data.busList.filter(b => b.id !== busId);
    this.setData({ busList: newList });
    wx.showToast({ title: '删除成功', icon: 'success' });
  },

  viewBookings() {
    const allBookings = wx.getStorageSync('allBookings') || [];
    wx.navigateTo({
      url: `/pages/admin/bookings/bookings?allBookings=${encodeURIComponent(JSON.stringify(allBookings))}`
    });
  },

  markMissedRidersx() {
    const allBookings = wx.getStorageSync('allBookings') || [];
    const userStats = wx.getStorageSync('userStats') || {};
  
    const today = new Date().toISOString().slice(0, 10);
    const missed = allBookings.filter(b => b.date === today && !b.checkedIn);
  
    missed.forEach(b => {
      const uid = b.userId;
      if (!userStats[uid]) {
        userStats[uid] = { cancelHistory: [], missedCount: 0, bannedUntil: '' };
      }
      userStats[uid].missedCount += 1;
  
      if (userStats[uid].missedCount >= 3) {
        const banDate = new Date();
        banDate.setDate(banDate.getDate() + 7);
        userStats[uid].bannedUntil = banDate.toISOString().slice(0, 10);
      }
    });
  
    wx.setStorageSync('userStats', userStats);
    wx.showToast({ title: '处理完成', icon: 'success' });
  }
});