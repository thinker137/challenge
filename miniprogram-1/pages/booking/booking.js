// pages/booking/booking.js
import busData from './utils/bus-data.js'; // 修正导入路径

Page({
  data: {
    directions: ['本部->新校区', '新校区->本部'],
    selectedDirection: '',
    selectedDate: '',
    availableBuses: [],
    selectedBusId: '',
    bookingSuccess: false,
    bookingId: '',
    userId: '',
    nickName: '',
    role: '',
    avatarUrl: '' // 添加头像URL，防止渲染错误
  },

  onLoad(options) {
    this.setData({
      userId: decodeURIComponent(options.userId || ''),
      nickName: decodeURIComponent(options.nickName || ''),
      role: decodeURIComponent(options.role || ''),
      // 设置默认日期为今天
      selectedDate: this.formatDate(new Date())
    });
    this.filterBuses();
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onDirectionChange(e) {
    this.setData({
      selectedDirection: this.data.directions[e.detail.value],
      selectedBusId: ''
    });
    this.filterBuses();
  },

  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value,
      selectedBusId: ''
    });
    this.filterBuses();
  },

  onBusSelect(e) {
    this.setData({
      selectedBusId: e.currentTarget.dataset.id
    });
  },

  filterBuses() {
    const { selectedDirection, selectedDate } = this.data;
    if (!selectedDirection) return;

    // 根据选择的方向筛选班车
    let filteredBuses = busData.filter(bus => bus.direction === selectedDirection);

    // 根据日期判断星期几，进一步筛选符合周期的班车
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0-6, 0是周日
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    filteredBuses = filteredBuses.filter(bus => {
      if (bus.cycle === '周一到周日') return true;
      if (bus.cycle === '周一到周五' && isWeekday) return true;
      return false;
    });

    this.setData({
      availableBuses: filteredBuses
    });
  },

  submitBooking() {
    const { selectedDirection, selectedDate, selectedBusId, userId, nickName } = this.data;

    if (!selectedDirection || !selectedDate || !selectedBusId) {
      wx.showToast({
        title: '请填写完整预约信息',
        icon: 'none'
      });
      return;
    }

    const selectedBus = busData.find(bus => bus.id === selectedBusId);
    if (!selectedBus) {
      wx.showToast({
        title: '无效的班车选择',
        icon: 'none'
      });
      return;
    }

    const allBookings = wx.getStorageSync('allBookings') || [];

    // 检查是否已预约该方向的班车
    const hasBooked = allBookings.some(item => 
      item.userId === userId && 
      item.date === selectedDate && 
      item.direction === selectedDirection
    );

    if (hasBooked) {
      wx.showToast({
        title: '你今天已预约过该方向的班车',
        icon: 'none'
      });
      return;
    }

    const randomId = 'R' + Math.floor(1000 + Math.random() * 9000);

    const newBooking = {
      userId,
      nickName,
      direction: selectedDirection,
      busId: selectedBusId,
      busInfo: {
        plateNumber: selectedBus.plateNumber,
        driver: selectedBus.driver,
        phone: selectedBus.phone,
        departureTime: selectedBus.departureTime,
        departureLocation: selectedBus.departureLocation,
        arrivalLocation: selectedBus.arrivalLocation
      },
      date: selectedDate,
      bookingId: randomId,
      checkedIn: false
    };

    allBookings.push(newBooking);
    wx.setStorageSync('allBookings', allBookings);

    this.setData({
      bookingSuccess: true,
      bookingId: randomId
    });

    wx.showToast({
      title: '预约成功',
      icon: 'success'
    });
  },

  goToMyBookings() {
    wx.navigateTo({
      url: `/pages/mybookings/mybookings?userId=${encodeURIComponent(this.data.userId)}`
    });
  }
});