Page({
  data: {
    allBookings: []
  },

  onLoad(options) {
    if (options.allBookings) {
      const allBookings = JSON.parse(decodeURIComponent(options.allBookings));
      this.setData({ allBookings });
    }
  }
});