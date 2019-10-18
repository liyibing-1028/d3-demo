      isLoading: false,
      sTimeout: 2500,
      message: '',
      snackbar: false,
      offSet: 200,
      isDrag: false,
      isRollColumn: true,
      isRollRow: true,
      expand: true,
      isDiscoloration: true,
      // 时间筛选
      time: 'time',
      // 分页
      totalVisible: 7,
      needFstLast: true,
      // 识别数据
      signList: [
        {key: 0, value: '未标记'},
        {key: 1, value: '加黑'},
        {key: 2, value: '加灰'}
      ],
      signList2: [
        {key: 1, value: '加黑'},
        {key: 2, value: '加灰'}
      ],
      signShow: true,
      // 类型数据
      typeList: [
        {key: 0, value: '未识别'},
        {key: 1, value: '仿冒公安'},
        {key: 2, value: '仿冒检查院'},
        {key: 3, value: '仿冒法院'},
        {key: 4, value: '仿冒政府官网'}
      ],
      // 手机号详情页
      detaiDialog: false,
      detailsWid: 0,
      detaiHeight: $(window).height() - 202,
      detaiPageSize: parseInt(($(window).height() - 250) / 48),
      detaiPage: 1,
      detaiPageLen: 1,
      detaiTableStatus: {
        id: true,
        phone: true,
        etime: true,
        pcity: true,
        pv: true,
        psign: true
      },
      detaiHeaders: [
        {'text': '#', 'value': 'id', 'width': '60'},
        {'text': '手机号', 'value': 'phone', 'width': '150'},
        {'text': '最后通话时间', 'value': 'etime', 'width': '160'},
        {'text': '归属地', 'value': 'pcity', 'width': '120'},
        {'text': '通话次数', 'value': 'pv', 'width': '100'},
        {'text': '状态', 'value': 'psign', 'width': '150'}
      ],
      detaiItems: [],
      phoneArr: [],
      clickIpCopy: '',
      // 弹框
      openDialog: false,
      address: '',