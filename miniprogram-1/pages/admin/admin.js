Page({
  data: {
    busList: [
      { id: 1, name: '1号线', seatCount: 30 },
      { id: 2, name: '2号线', seatCount: 30 },
      { id: 3, name: '5号线', seatCount: 30 },
      { id: 4, name: '网安校巴', seatCount: 30 }
    ],
    newBusName: '',
    newSeatCount: 30,
    editingBusId: null,
    editingBusName: '',
    editingSeatCount: ''
  },

  onInputBusName(e) {
    this.setData({ newBusName: e.detail.value });
  },

  onInputSeatCount(e) {
    this.setData({ newSeatCount: parseInt(e.detail.value) || 30 });
  },

  addBus() {
    const { newBusName, newSeatCount, busList } = this.data;
    if (!newBusName.trim()) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      });
      return;
    }

    const newId = busList.length > 0 ? busList[busList.length - 1].id + 1 : 1;
    const newList = [...busList, { id: newId, name: newBusName, seatCount: newSeatCount }];

    this.setData({
      busList: newList,
      newBusName: '',
      newSeatCount: 30
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

  startEditBus(e) {
    const busId = e.currentTarget.dataset.id;
    const bus = this.data.busList.find(b => b.id === busId);
    this.setData({
      editingBusId: busId,
      editingBusName: bus.name,
      editingSeatCount: bus.seatCount.toString()
    });
  },

  onEditBusName(e) {
    this.setData({ editingBusName: e.detail.value });
  },

  onEditSeatCount(e) {
    this.setData({ editingSeatCount: e.detail.value });
  },

  saveEditBus() {
    const { editingBusId, editingBusName, editingSeatCount, busList } = this.data;
    if (!editingBusName.trim() || isNaN(Number(editingSeatCount))) {
      wx.showToast({
        title: '请输入有效的名称和座位数',
        icon: 'none'
      });
      return;
    }

    const newList = busList.map(bus => {
      if (bus.id === editingBusId) {
        return {
          ...bus,
          name: editingBusName,
          seatCount: Number(editingSeatCount)
        };
      }
      return bus;
    });

    this.setData({
      busList: newList,
      editingBusId: null,
      editingBusName: '',
      editingSeatCount: ''
    });

    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },

  cancelEditBus() {
    this.setData({
      editingBusId: null,
      editingBusName: '',
      editingSeatCount: ''
    });
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
  },

  exportBusStats() {
    const allBookings = wx.getStorageSync('allBookings') || [];
    const busStats = {};
  
    this.data.busList.forEach(bus => {
      const bookings = allBookings.filter(booking => booking.bus === bus.name);
      const checkedInBookings = bookings.filter(booking => booking.checkedIn);
  
      busStats[bus.name] = {
        bookedCount: bookings.length,
        checkedInCount: checkedInBookings.length
      };
    });
  
    // 将 busStats 转换为 CSV 格式的字符串
    let csvContent = "班车名称,预约人数,上车人数\n";
    for (const busName in busStats) {
      const stats = busStats[busName];
      csvContent += `${busName},${stats.bookedCount},${stats.checkedInCount}\n`;
    }
  
    // 创建文件并写入内容
    const fs = wx.getFileSystemManager();
    const filePath = wx.env.USER_DATA_PATH + '/bus_stats.csv';
    fs.writeFile({
      filePath: filePath,
      data: csvContent,
      encoding: 'utf8',
      success: () => {
        wx.showToast({
          title: '导出成功',
          icon: 'success'
        });
        console.log('文件已导出到:', filePath);
      },
      fail: (err) => {
        wx.showToast({
          title: '导出失败',
          icon: 'none'
        });
        console.error('导出失败:', err);
      }
    });
  }
});