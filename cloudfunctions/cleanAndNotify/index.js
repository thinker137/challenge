const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { bus_id, date } = event;
  const now = new Date();

  // 查询班车信息，确认发车时间
  const busRes = await db.collection('buses').where({ bus_id, date }).get();
  if (busRes.data.length === 0) {
    return { success: false, message: '班车不存在' };
  }
  const bus = busRes.data[0];
  const busDepartureTime = new Date(`${date}T${bus.time}:00`);

  // 判断是否在发车前1小时内
  if (busDepartureTime - now > 60 * 60 * 1000) {
    return { success: false, message: '发车时间未到1小时内' };
  }

  // 查询所有预约成功的记录，按编号升序排列
  const bookingsRes = await db.collection('bookings')
    .where({ bus_id, date, status: '预约成功' })
    .orderBy('number', 'asc')
    .get();

  let bookings = bookingsRes.data;

  // 重新调整预约队列编号，确保编号连续且从1开始
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    if (booking.number !== i + 1) {
      await db.collection('bookings').doc(booking._id).update({
        data: { number: i + 1 }
      });
    }
  }

  // 遍历预约用户，发送微信订阅消息提醒（需用户先订阅模板消息）
  for (const booking of bookings) {
    const userRes = await db.collection('users').where({ _openid: booking.user_id }).get();
    if (userRes.data.length === 0) continue;

    try {
      await cloud.openapi.subscribeMessage.send({
        touser: booking.user_id,
        page: '/pages/booking/booking',
        data: {
          thing1: { value: `您预约的班车 ${bus_id} 将于1小时内发车，请准时乘车。` },
          date2: { value: date }
        },
        
      });
    } catch (err) {
      console.error(`给用户${booking.user_id}发送提醒失败:`, err);
    }
  }

  return { success: true, message: '预约编号调整并提醒已发送' };
};
