// pages/booking/utils/bus-data.js
const busData = [
  // 本部到新校区
  {
    id: 'bus1',
    direction: '本部->新校区',
    plateNumber: '鄂AYB260',
    driver: '杨师傅',
    phone: '13971341207',
    departureTime: '07:00',
    cycle: '周一到周五',
    departureLocation: '信息学部国重门口',
    arrivalLocation: '新校区新珈楼'
  },
  {
    id: 'bus2',
    direction: '本部->新校区',
    plateNumber: '鄂ALB328',
    driver: '吴师傅',
    phone: '15907179119',
    departureTime: '12:40',
    cycle: '周一到周五',
    departureLocation: '信息学部国重门口',
    arrivalLocation: '新校区新珈楼'
  },
  {
    id: 'bus3',
    direction: '本部->新校区',
    plateNumber: '鄂ALB160',
    driver: '范师傅',
    phone: '13349989991',
    departureTime: '19:00',
    cycle: '周一到周日',
    departureLocation: '本部当代楼校巴站',
    arrivalLocation: '新校区一食堂'
  },
  // 新校区到本部
  {
    id: 'bus4',
    direction: '新校区->本部',
    plateNumber: '鄂ALB160',
    driver: '范师傅',
    phone: '13349989991',
    departureTime: '06:40',
    cycle: '周一到周日',
    departureLocation: '新校区一食堂',
    arrivalLocation: '本部当代楼校巴站'
  },
  {
    id: 'bus5',
    direction: '新校区->本部',
    plateNumber: '鄂AYB260',
    driver: '杨师傅',
    phone: '13971341207',
    departureTime: '12:20',
    cycle: '周一到周五',
    departureLocation: '新校区新珈楼',
    arrivalLocation: '本部当代楼校巴站'
  },
  {
    id: 'bus6',
    direction: '新校区->本部',
    plateNumber: '鄂ALB38',
    driver: '吴师傅',
    phone: '15907179119',
    departureTime: '17:30',
    cycle: '周一到周五',
    departureLocation: '新校区新珈楼',
    arrivalLocation: '信息学部国重门口'
  }
];

export default busData;