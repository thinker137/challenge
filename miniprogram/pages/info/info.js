Page({
  data: {
    roleOptions: ['学生', '教师', '管理员', '班车师傅', '临时账号'],
    selectedRole: '',
    userId: '',
    nickName: '',
    avatarUrl: ''
  },

  onLoad(options) {
    this.setData({
      nickName: decodeURIComponent(options.nickName || ''),
      avatarUrl: decodeURIComponent(options.avatarUrl || '')
    })
  },

  onRoleChange(e) {
    const index = e.detail.value
    this.setData({
      selectedRole: this.data.roleOptions[index]
    })
  },

  onUserIdInput(e) {
    this.setData({
      userId: e.detail.value
    })
  },

  goToNext() {
    const { userId, selectedRole, nickName, avatarUrl } = this.data
    if (!userId || !selectedRole) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
  
    if (selectedRole === '管理员') {
      // 管理员跳转到管理员页面
      wx.navigateTo({
        url: `/pages/admin/admin?userId=${encodeURIComponent(userId)}&nickName=${encodeURIComponent(nickName)}&avatarUrl=${encodeURIComponent(avatarUrl)}`
      })
    } else {
      // 其他角色跳转预约页面
      wx.navigateTo({
        url: `/pages/booking/booking?userId=${encodeURIComponent(userId)}&role=${encodeURIComponent(selectedRole)}&nickName=${encodeURIComponent(nickName)}&avatarUrl=${encodeURIComponent(avatarUrl)}`
      })
    }
  }
})