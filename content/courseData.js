var courseData = {
    launchTrack: 'main',
    tracks: {
        'main': {
            id: 'main',
            label: 'Main Track',	
			chapters:['c1','c1_2','c2','c3','c4','c5','c6','c6_2','c7','c8','c8_2','c9','c10','c11','c11_2','c11_3','c12','c12_2','c13','c14','c14_2','c15','c16','c16_2','c16_3','c17','c17_2','c17_3','c18'],
            storageMode: 'SCORM Driver',
            storageKey: 'bi_ipadtut'
        }
    },
    chapters: {
        'c1': {
            id: 'c1',
            label: 'iRep总体介绍-1',
            pages: ['c1_p1']
        }, 
        'c1_2': {
            id: 'c1_2',
            label: 'iRep总体介绍-2',
            pages: ['c1_p2']
        },		
        'c2': {
            id: 'c2',
            label: '登陆介绍',
            pages: ['c2_p1']
        },
        'c3': {
            id: 'c3',
            label: '区域信息管理',
            pages: ['c3_p1']
        },
        'c4': {
            id: 'c4',
            label: '如何设定目标客户',
            pages: ['c4_p1']
        },
        'c5': {
            id: 'c5',
            label: '如何管理客户',
            pages: ['c5_p1']
        },
        'c6': {
            id: 'c6',
            label: '如何新增客户信息-1',
            pages: ['c6_p1']
        },
        'c6_2': {
            id: 'c6_2',
            label: '如何新增客户信息-2',
            pages: ['c6_p2']
        },
        'c7': {
            id: 'c7',
            label: '如何修改客户的基本信息',
            pages: ['c7_p1']
        },
        'c8': {
            id: 'c8',
            label: '如何修改客户所属的科室-1',
            pages: ['c8_p1']
        },
        'c8_2': {
            id: 'c8_2',
            label: '如何修改客户所属的科室-2',
            pages: ['c8_p2']
        },
        'c9': {
            id: 'c9',
            label: '如何删除客户',
            pages: ['c9_p1']
        },
        'c10': {
            id: 'c10',
            label: '如何录入拜访计划',
            pages: ['c10_p1']
        },
        'c11': {
            id: 'c11',
            label: '拜访录入-1',
            pages: ['c11_p1']
        },
        'c11_2': {
            id: 'c11_2',
            label: '拜访录入-2',
            pages: ['c11_p2']
        },
        'c11_3': {
            id: 'c11_3',
            label: '拜访录入-3',
            pages: ['c11_p3']
        },		
        'c12': {
            id: 'c12',
            label: '计划外拜访录入-1',
            pages: ['c12_p1']
        },
        'c12_2': {
            id: 'c12_2',
            label: '计划外拜访录入-2',
            pages: ['c12_p2']
        },
        'c13': {
            id: 'c13',
            label: '更新客户对产品的认知度',
            pages: ['c13_p1']
        },
        'c14': {
            id: 'c14',
            label: '科院内会',
            pages: ['c14_p1']
        },
        'c14_2': {
            id: 'c14_2',
            label: '科院内会',
            pages: ['c14_p2']
        },
        'c15': {
            id: 'c15',
            label: '区域外时间管理',
            pages: ['c15_p1']
        },
        'c16': {
            id: 'c16',
            label: '辅导拜访-1',
            pages: ['c16_p1']
        },
        'c16_2': {
            id: 'c16_2',
            label: '辅导拜访-2',
            pages: ['c16_p2']
        },
        'c16_3': {
            id: 'c16_3',
            label: '辅导拜访-3',
            pages: ['c16_p3']
        },
        'c17': {
            id: 'c17',
            label: '实地辅导代表-1',
            pages: ['c17_p1']
        },	
        'c17_2': {
            id: 'c17_2',
            label: '实地辅导代表-2',
            pages: ['c17_p2']
        },	
        'c17_3': {
            id: 'c17_3',
            label: '实地辅导代表-3',
            pages: ['c17_p3']
        },	
        'c18': {
            id: 'c18',
            label: '报告',
            pages: ['c18_p1']
        }
    },
    pages: {
        'c1_p1': {
            id: 'c1_p1',
            label: 'iRep总体介绍',
            path: 'pages/bi_ipadtut_c1_p1.html',
            slides: [
                {id: 'c1_p1_001', type: 'static', audio: 'audio/00.mp3'},  /* 1 */
				{id: 'c1_p1_002', type: 'static', audio: 'audio/00.mp3'},
                {id: 'c1_p1_003', type: 'static', audio: 'audio/03.mp3'}
                // {id: 'c1_p1_004', type: 'static', audio: 'audio/04.mp3'},
                // {id: 'c1_p1_005', type: 'static', audio: 'audio/05.mp3'},
                // {id: 'c1_p1_006', type: 'static', audio: 'audio/06.mp3'},
                // {id: 'c1_p1_007', type: 'static', audio: 'audio/07.mp3'},
                // {id: 'c1_p1_008', type: 'static', audio: 'audio/08.mp3'},
                // {id: 'c1_p1_009', type: 'static', audio: 'audio/09.mp3'},
                // {id: 'c1_p1_010', type: 'static', audio: 'audio/10.mp3'},
                // {id: 'c1_p1_011', type: 'interactive', audio: 'audio/11.mp3'},
                // {id: 'c1_p1_012', type: 'static', audio: 'audio/12.mp3'} /* 12 */
            ]
        },

        'c1_p2': {
            id: 'c1_p2',
            label: 'iRep总体介绍',
            path: 'pages/bi_ipadtut_c1_p2.html',
            slides: [
                {id: 'c1_p1_004', type: 'static', audio: 'audio/04.mp3'},
                {id: 'c1_p1_005', type: 'static', audio: 'audio/05.mp3'},
                {id: 'c1_p1_006', type: 'static', audio: 'audio/06.mp3'},
                {id: 'c1_p1_007', type: 'static', audio: 'audio/07.mp3'},
                {id: 'c1_p1_008', type: 'static', audio: 'audio/08.mp3'},
                {id: 'c1_p1_009', type: 'static', audio: 'audio/09.mp3'},
                {id: 'c1_p1_010', type: 'static', audio: 'audio/10.mp3'},
                {id: 'c1_p1_011', type: 'interactive', audio: 'audio/11.mp3'},
                {id: 'c1_p1_012', type: 'static', audio: 'audio/12.mp3'} /* 12 */
            ]
        },
		
        'c2_p1': {
            id: 'c2_p1',
            label: '登陆介绍',
            path: 'pages/bi_ipadtut_c2_p1.html',
            slides: [
                  {id: 'c2_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 13 */
                  {id: 'c2_p1_002', type: 'static', audio: 'audio/14.mp3'},
                  {id: 'c2_p1_003', type: 'static', audio: 'audio/15.mp3'},
                  {id: 'c2_p1_004', type: 'static', audio: 'audio/16.mp3'},
                  {id: 'c2_p1_005', type: 'static', audio: 'audio/17.mp3'},
                  {id: 'c2_p1_006', type: 'static', audio: 'audio/18.mp3'},
                  {id: 'c2_p1_007', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c2_p1_008', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c2_p1_009', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c2_p1_010', type: 'static', audio: 'audio/22.mp3'},
                  {id: 'c2_p1_011', type: 'static', audio: 'audio/23.mp3'},
                  {id: 'c2_p1_012', type: 'static', audio: 'audio/24.mp3'}  /* 24 */
            ]
        },
        'c3_p1': {
            id: 'c3_p1',
            label: '区域信息管理',
            path: 'pages/bi_ipadtut_c3_p1.html',
            slides: [
                 
                  {id: 'c3_p1_001', type: 'static', audio: ''}, /* 25 */
                  {id: 'c3_p1_002', type: 'static', audio: 'audio/26.mp3'},
                  {id: 'c3_p1_003', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c3_p1_004', type: 'static', audio: 'audio/28.mp3'},
                  {id: 'c3_p1_005', type: 'static', audio: 'audio/29.mp3'},
                  {id: 'c3_p1_006', type: 'static', audio: 'audio/30.mp3'},
                  {id: 'c3_p1_007', type: 'static', audio: ''},
                  {id: 'c3_p1_008', type: 'static', audio: 'audio/32.mp3'},
                  {id: 'c3_p1_009', type: 'static', audio: 'audio/33.mp3'},
                  {id: 'c3_p1_010', type: 'static', audio: 'audio/00.mp3'} /* 34 */
            ]
        },
        
        'c4_p1': {
            id: 'c4_p1',
            label: '如何设定目标客户',
            path: 'pages/bi_ipadtut_c4_p1.html',
            slides: [
                 
                  {id: 'c4_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 35 */
                  {id: 'c4_p1_002', type: 'interactive', audio: 'audio/36.mp3'},
                  {id: 'c4_p1_003', type: 'interactive', audio: 'audio/37.mp3'},
                  {id: 'c4_p1_004', type: 'static', audio: 'audio/38.mp3'},
                  {id: 'c4_p1_005', type: 'interactive', audio: 'audio/39.mp3'},
                  {id: 'c4_p1_006', type: 'interactive', audio: 'audio/40.mp3'},
                  {id: 'c4_p1_007', type: 'interactive', audio: 'audio/41.mp3'},
                  {id: 'c4_p1_008', type: 'interactive', audio: 'audio/42.mp3'},
                  {id: 'c4_p1_009', type: 'interactive', audio: 'audio/43.mp3'},
                  {id: 'c4_p1_010', type: 'interactive', audio: 'audio/44.mp3'},
                  {id: 'c4_p1_011', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c4_p1_012', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c4_p1_013', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c4_p1_014', type: 'interactive', audio: 'audio/48.mp3'},
                  {id: 'c4_p1_015', type: 'interactive', audio: 'audio/49.mp3'} /* 49 */
            ]
        },

        'c5_p1': {
            id: 'c5_p1',
            label: '如何管理客户',
            path: 'pages/bi_ipadtut_c5_p1.html',
            slides: [
                 
                  {id: 'c5_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 50 */
                  {id: 'c5_p1_002', type: 'static', audio: 'audio/51.mp3'},
                  {id: 'c5_p1_003', type: 'static', audio: 'audio/52.mp3'} /* 52 */
            ]
        },
		
        'c6_p1': {
            id: 'c6_p1',
            label: '如何新增客户信息',
            path: 'pages/bi_ipadtut_c6_p1.html',
            slides: [
                 
                  {id: 'c6_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 53 */
                  {id: 'c6_p1_002', type: 'static', audio: 'audio/54.mp3'},
                  {id: 'c6_p1_003', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c6_p1_004', type: 'interactive', audio: 'audio/56.mp3'},
                  {id: 'c6_p1_005', type: 'interactive', audio: 'audio/57.mp3'},
                  {id: 'c6_p1_006', type: 'interactive', audio: 'audio/58.mp3'},
                  {id: 'c6_p1_007', type: 'interactive', audio: 'audio/59.mp3'},
                  {id: 'c6_p1_008', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c6_p1_009', type: 'interactive', audio: 'audio/61.mp3'},
                  {id: 'c6_p1_010', type: 'interactive', audio: 'audio/62.mp3'}
                  // {id: 'c6_p1_011', type: 'interactive', audio: 'audio/63.mp3'},
                  // {id: 'c6_p1_012', type: 'interactive', audio: 'audio/64.mp3'},
                  // {id: 'c6_p1_013', type: 'interactive', audio: 'audio/65.mp3'},
                  // {id: 'c6_p1_014', type: 'interactive', audio: 'audio/66.mp3'},
                  // {id: 'c6_p1_015', type: 'interactive', audio: 'audio/67.mp3'},
                  // {id: 'c6_p1_016', type: 'interactive', audio: 'audio/68.mp3'}, /* 68 */
                  // {id: 'c6_p1_017', type: 'interactive', audio: 'audio/69.mp3'}, /* 69 */
                  // {id: 'c6_p1_018', type: 'interactive', audio: 'audio/70.mp3'}, /* 70 */
                  // {id: 'c6_p1_019', type: 'interactive', audio: 'audio/71.mp3'}, /* 71 */
                  // {id: 'c6_p1_020', type: 'interactive', audio: 'audio/72.mp3'}, /* 72 */
                  // {id: 'c6_p1_021', type: 'interactive', audio: 'audio/73.mp3'}, /* 73 */
                  // {id: 'c6_p1_022', type: 'interactive', audio: 'audio/74.mp3'}, /* 74 */
                  // {id: 'c6_p1_023', type: 'interactive', audio: 'audio/75.mp3'}, /* 75 */
                  // {id: 'c6_p1_024', type: 'interactive', audio: 'audio/76.mp3'} /* 76 */
            ]
        },     

        'c6_p2': {
            id: 'c6_p2',
            label: '如何新增客户信息',
            path: 'pages/bi_ipadtut_c6_p2.html',
            slides: [
                 
                  {id: 'c6_p1_011', type: 'interactive', audio: 'audio/63.mp3'},
                  {id: 'c6_p1_012', type: 'interactive', audio: 'audio/64.mp3'},
                  {id: 'c6_p1_013', type: 'interactive', audio: 'audio/65.mp3'},
                  {id: 'c6_p1_014', type: 'interactive', audio: 'audio/66.mp3'},
                  {id: 'c6_p1_015', type: 'interactive', audio: 'audio/67.mp3'},
                  {id: 'c6_p1_016', type: 'interactive', audio: 'audio/68.mp3'}, /* 68 */
                  {id: 'c6_p1_017', type: 'interactive', audio: 'audio/69.mp3'}, /* 69 */
                  {id: 'c6_p1_018', type: 'interactive', audio: 'audio/70.mp3'}, /* 70 */
                  {id: 'c6_p1_019', type: 'interactive', audio: 'audio/71.mp3'}, /* 71 */
                  {id: 'c6_p1_020', type: 'interactive', audio: 'audio/72.mp3'}, /* 72 */
                  {id: 'c6_p1_021', type: 'interactive', audio: 'audio/73.mp3'}, /* 73 */
                  {id: 'c6_p1_022', type: 'interactive', audio: 'audio/74.mp3'}, /* 74 */
                  {id: 'c6_p1_023', type: 'interactive', audio: 'audio/75.mp3'}, /* 75 */
                  {id: 'c6_p1_024', type: 'interactive', audio: 'audio/76.mp3'} /* 76 */
            ]
        },    
		
        'c7_p1': {
            id: 'c7_p1',
            label: '如何修改客户的基本信息',
            path: 'pages/bi_ipadtut_c7_p1.html',
            slides: [
                 
                  {id: 'c7_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 77 */
                  {id: 'c7_p1_002', type: 'interactive', audio: 'audio/78.mp3'},
                  {id: 'c7_p1_003', type: 'interactive', audio: 'audio/79.mp3'},
                  {id: 'c7_p1_004', type: 'interactive', audio: 'audio/80.mp3'},  /* 80 */
                  {id: 'c7_p1_005', type: 'interactive', audio: 'audio/81.mp3'}, /* 81 */
                  {id: 'c7_p1_006', type: 'interactive', audio: 'audio/82.mp3'}, /* 82 */
                  {id: 'c7_p1_007', type: 'interactive', audio: 'audio/83.mp3'}, /* 83 */
                  {id: 'c7_p1_008', type: 'interactive', audio: 'audio/84.mp3'}, /* 84 */
                  {id: 'c7_p1_009', type: 'interactive', audio: 'audio/85.mp3'} /* 85 */
            ]
        },
 
        'c8_p1': {
            id: 'c8_p1',
            label: '如何修改客户所属的科室',
            path: 'pages/bi_ipadtut_c8_p1.html',
            slides: [
                 
                  {id: 'c8_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 86 */
                  {id: 'c8_p1_002', type: 'interactive', audio: 'audio/87.mp3'},
                  {id: 'c8_p1_003', type: 'interactive', audio: 'audio/88.mp3'},
                  {id: 'c8_p1_004', type: 'interactive', audio: 'audio/89.mp3'},
                  {id: 'c8_p1_005', type: 'interactive', audio: 'audio/90.mp3'},
                  {id: 'c8_p1_006', type: 'interactive', audio: 'audio/91.mp3'},
                  {id: 'c8_p1_007', type: 'interactive', audio: 'audio/92.mp3'}, /* 92 */
                  {id: 'c8_p1_008', type: 'interactive', audio: 'audio/93.mp3'}, /* 93 */
                  {id: 'c8_p1_009', type: 'interactive', audio: 'audio/94.mp3'}, /* 94 */
                  {id: 'c8_p1_010', type: 'interactive', audio: 'audio/95.mp3'} /* 95 */
                  // {id: 'c8_p1_011', type: 'interactive', audio: 'audio/96.mp3'}, /* 96 */
                  // {id: 'c8_p1_012', type: 'interactive', audio: 'audio/97.mp3'}, /* 97 */
                  // {id: 'c8_p1_013', type: 'interactive', audio: 'audio/98.mp3'}, /* 98 */
                  // {id: 'c8_p1_014', type: 'interactive', audio: 'audio/99.mp3'}, /* 99 */
                  // {id: 'c8_p1_015', type: 'interactive', audio: 'audio/100.mp3'}, /* 100 */
                  // {id: 'c8_p1_016', type: 'interactive', audio: 'audio/101.mp3'}, /* 101 */
                  // {id: 'c8_p1_017', type: 'interactive', audio: 'audio/102.mp3'}, /* 102 */
                  // {id: 'c8_p1_018', type: 'interactive', audio: 'audio/103.mp3'}, /* 103 */
                  // {id: 'c8_p1_019', type: 'interactive', audio: 'audio/104.mp3'} /* 104 */
            ]
        },

        'c8_p2': {
            id: 'c8_p2',
            label: '如何修改客户所属的科室',
            path: 'pages/bi_ipadtut_c8_p2.html',
            slides: [
                 
                  {id: 'c8_p1_011', type: 'interactive', audio: 'audio/96.mp3'}, /* 96 */
                  {id: 'c8_p1_012', type: 'interactive', audio: 'audio/97.mp3'}, /* 97 */
                  {id: 'c8_p1_013', type: 'interactive', audio: 'audio/98.mp3'}, /* 98 */
                  {id: 'c8_p1_014', type: 'interactive', audio: 'audio/99.mp3'}, /* 99 */
                  {id: 'c8_p1_015', type: 'interactive', audio: 'audio/100.mp3'}, /* 100 */
                  {id: 'c8_p1_016', type: 'interactive', audio: 'audio/101.mp3'}, /* 101 */
                  {id: 'c8_p1_017', type: 'interactive', audio: 'audio/102.mp3'}, /* 102 */
                  {id: 'c8_p1_018', type: 'interactive', audio: 'audio/103.mp3'}, /* 103 */
                  {id: 'c8_p1_019', type: 'interactive', audio: 'audio/104.mp3'} /* 104 */
            ]
        },
		
        'c9_p1': {
            id: 'c9_p1',
            label: '如何删除客户',
            path: 'pages/bi_ipadtut_c9_p1.html',
            slides: [
                 
                  {id: 'c9_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 105 */
                  {id: 'c9_p1_002', type: 'interactive', audio: 'audio/106.mp3'}, /* 106 */
                  {id: 'c9_p1_003', type: 'interactive', audio: 'audio/107.mp3'}, /* 107 */
                  {id: 'c9_p1_004', type: 'interactive', audio: 'audio/108.mp3'}, /* 108 */
                  {id: 'c9_p1_005', type: 'interactive', audio: 'audio/109.mp3'}, /* 109 */
                  {id: 'c9_p1_006', type: 'interactive', audio: 'audio/110.mp3'}, /* 110 */
                  {id: 'c9_p1_007', type: 'interactive', audio: 'audio/111.mp3'}, /* 111 */
                  {id: 'c9_p1_008', type: 'interactive', audio: 'audio/112.mp3'}, /* 112 */
                  {id: 'c9_p1_009', type: 'interactive', audio: 'audio/113.mp3'} /* 113 */
            ]
        },
		
        'c10_p1': {
            id: 'c10_p1',
            label: '如何录入拜访计划',
            path: 'pages/bi_ipadtut_c10_p1.html',
            slides: [
                 
                  {id: 'c10_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 114 */
                  {id: 'c10_p1_002', type: 'static', audio: 'audio/115.mp3'},
                  {id: 'c10_p1_003', type: 'static', audio: 'audio/116.mp3'},
                  {id: 'c10_p1_004', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c10_p1_005', type: 'interactive', audio: 'audio/118.mp3'},
                  {id: 'c10_p1_006', type: 'interactive', audio: 'audio/119.mp3'},
                  {id: 'c10_p1_007', type: 'interactive', audio: 'audio/120.mp3'},
                  {id: 'c10_p1_008', type: 'interactive', audio: 'audio/121.mp3'},
                  {id: 'c10_p1_009', type: 'interactive', audio: 'audio/122.mp3'},
                  {id: 'c10_p1_010', type: 'interactive', audio: 'audio/123.mp3'},
                  {id: 'c10_p1_011', type: 'interactive', audio: 'audio/124.mp3'},
                  {id: 'c10_p1_012', type: 'interactive', audio: 'audio/125.mp3'} /* 125 */
            ]
        },

        'c11_p1': {
            id: 'c11_p1',
            label: '拜访录入',
            path: 'pages/bi_ipadtut_c11_p1.html',
            slides: [
                 
                  {id: 'c11_p1_001', type: 'static', audio: 'audio/126.mp3'}, /* 126 */
                  {id: 'c11_p1_002', type: 'static', audio: 'audio/127.mp3'},
                  {id: 'c11_p1_003', type: 'static', audio: 'audio/128.mp3'},
                  {id: 'c11_p1_004', type: 'interactive', audio: 'audio/129.mp3'},
                  {id: 'c11_p1_005', type: 'interactive', audio: 'audio/130.mp3'},
                  {id: 'c11_p1_006', type: 'interactive', audio: 'audio/131.mp3'},
                  {id: 'c11_p1_007', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c11_p1_008', type: 'interactive', audio: 'audio/133.mp3'},
                  {id: 'c11_p1_009', type: 'interactive', audio: 'audio/134.mp3'},
                  {id: 'c11_p1_010', type: 'interactive', audio: 'audio/135.mp3'}
                  // {id: 'c11_p1_011', type: 'interactive', audio: 'audio/136.mp3'},
                  // {id: 'c11_p1_012', type: 'interactive', audio: 'audio/137.mp3'},
                  // {id: 'c11_p1_013', type: 'interactive', audio: 'audio/138.mp3'},
                  // {id: 'c11_p1_014', type: 'interactive', audio: 'audio/00.mp3'},
                  // {id: 'c11_p1_015', type: 'interactive', audio: 'audio/140.mp3'},
                  // {id: 'c11_p1_016', type: 'interactive', audio: 'audio/141.mp3'},
                  // {id: 'c11_p1_017', type: 'interactive', audio: 'audio/142.mp3'},
                  // {id: 'c11_p1_018', type: 'interactive', audio: 'audio/143.mp3'},
                  // {id: 'c11_p1_019', type: 'interactive', audio: 'audio/144.mp3'},
                  // {id: 'c11_p1_020', type: 'interactive', audio: 'audio/00.mp3'},
                  // {id: 'c11_p1_021', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c11_p1_022', type: 'interactive', audio: 'audio/147.mp3'},
                  // {id: 'c11_p1_023', type: 'interactive', audio: 'audio/148.mp3'},
                  // {id: 'c11_p1_024', type: 'interactive', audio: 'audio/149.mp3'},
                  // {id: 'c11_p1_025', type: 'interactive', audio: 'audio/150.mp3'},
                  // {id: 'c11_p1_026', type: 'interactive', audio: 'audio/151.mp3'},
                  // {id: 'c11_p1_027', type: 'interactive', audio: 'audio/00.mp3'},
                  // {id: 'c11_p1_028', type: 'interactive', audio: 'audio/153.mp3'} /* 153 */

            ]
        },
		
        'c11_p2': {
            id: 'c11_p2',
            label: '拜访录入',
            path: 'pages/bi_ipadtut_c11_p2.html',
            slides: [
                 
                  {id: 'c11_p1_011', type: 'interactive', audio: 'audio/136.mp3'},
                  {id: 'c11_p1_012', type: 'interactive', audio: 'audio/137.mp3'},
                  {id: 'c11_p1_013', type: 'interactive', audio: 'audio/138.mp3'},
                  {id: 'c11_p1_014', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c11_p1_015', type: 'interactive', audio: 'audio/140.mp3'},
                  {id: 'c11_p1_016', type: 'interactive', audio: 'audio/141.mp3'},
                  {id: 'c11_p1_017', type: 'interactive', audio: 'audio/142.mp3'},
                  {id: 'c11_p1_018', type: 'interactive', audio: 'audio/143.mp3'},
                  {id: 'c11_p1_019', type: 'interactive', audio: 'audio/144.mp3'},
                  {id: 'c11_p1_020', type: 'interactive', audio: 'audio/00.mp3'}

            ]
        },
		
        'c11_p3': {
            id: 'c11_p3',
            label: '拜访录入',
            path: 'pages/bi_ipadtut_c11_p3.html',
            slides: [

                  {id: 'c11_p1_021', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c11_p1_022', type: 'interactive', audio: 'audio/147.mp3'},
                  {id: 'c11_p1_023', type: 'interactive', audio: 'audio/148.mp3'},
                  {id: 'c11_p1_024', type: 'interactive', audio: 'audio/149.mp3'},
                  {id: 'c11_p1_025', type: 'interactive', audio: 'audio/150.mp3'},
                  {id: 'c11_p1_026', type: 'interactive', audio: 'audio/151.mp3'},
                  {id: 'c11_p1_027', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c11_p1_028', type: 'interactive', audio: 'audio/153.mp3'} /* 153 */

            ]
        },		

        'c12_p1': {
            id: 'c12_p1',
            label: '计划外拜访录入',
            path: 'pages/bi_ipadtut_c12_p1.html',
            slides: [
                 
                  {id: 'c12_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 154 */
                  {id: 'c12_p1_002', type: 'static', audio: 'audio/155.mp3'},
                  {id: 'c12_p1_003', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c12_p1_004', type: 'static', audio: 'audio/157.mp3'},
                  {id: 'c12_p1_005', type: 'static', audio: 'audio/158.mp3'},
                  {id: 'c12_p1_006', type: 'static', audio: 'audio/159.mp3'},
                  {id: 'c12_p1_007', type: 'static', audio: 'audio/160.mp3'},
                  {id: 'c12_p1_008', type: 'static', audio: 'audio/161.mp3'},
                  {id: 'c12_p1_009', type: 'static', audio: 'audio/162.mp3'},
                  {id: 'c12_p1_010', type: 'static', audio: 'audio/00.mp3'}
                  // {id: 'c12_p1_011', type: 'static', audio: 'audio/164.mp3'},
                  // {id: 'c12_p1_012', type: 'static', audio: 'audio/165.mp3'},
                  // {id: 'c12_p1_013', type: 'static', audio: 'audio/166.mp3'},
                  // {id: 'c12_p1_014', type: 'static', audio: 'audio/167.mp3'},
                  // {id: 'c12_p1_015', type: 'static', audio: 'audio/168.mp3'},
                  // {id: 'c12_p1_016', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c12_p1_017', type: 'static', audio: 'audio/170.mp3'},
                  // {id: 'c12_p1_018', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c12_p1_019', type: 'static', audio: 'audio/172.mp3'},
                  // {id: 'c12_p1_020', type: 'static', audio: 'audio/173.mp3'},
                  // {id: 'c12_p1_021', type: 'static', audio: 'audio/174.mp3'},
                  // {id: 'c12_p1_022', type: 'static', audio: 'audio/175.mp3'},
                  // {id: 'c12_p1_023', type: 'static', audio: 'audio/176.mp3'},
                  // {id: 'c12_p1_024', type: 'static', audio: 'audio/177.mp3'} /* 177 */

            ]
        },
		
        'c12_p2': {
            id: 'c12_p2',
            label: '计划外拜访录入',
            path: 'pages/bi_ipadtut_c12_p2.html',
            slides: [
                 
                  {id: 'c12_p1_011', type: 'static', audio: 'audio/164.mp3'},
                  {id: 'c12_p1_012', type: 'static', audio: 'audio/165.mp3'},
                  {id: 'c12_p1_013', type: 'static', audio: 'audio/166.mp3'},
                  {id: 'c12_p1_014', type: 'static', audio: 'audio/167.mp3'},
                  {id: 'c12_p1_015', type: 'static', audio: 'audio/168.mp3'},
                  {id: 'c12_p1_016', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c12_p1_017', type: 'static', audio: 'audio/170.mp3'},
                  {id: 'c12_p1_018', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c12_p1_019', type: 'static', audio: 'audio/172.mp3'},
                  {id: 'c12_p1_020', type: 'static', audio: 'audio/173.mp3'},
                  {id: 'c12_p1_021', type: 'static', audio: 'audio/174.mp3'},
                  {id: 'c12_p1_022', type: 'static', audio: 'audio/175.mp3'},
                  {id: 'c12_p1_023', type: 'static', audio: 'audio/176.mp3'},
                  {id: 'c12_p1_024', type: 'static', audio: 'audio/177.mp3'} /* 177 */

            ]
        },		
		
		
        'c13_p1': {
            id: 'c13_p1',
            label: '更新客户对产品的认知度',
            path: 'pages/bi_ipadtut_c13_p1.html',
            slides: [
                 
                  {id: 'c13_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 178 */
                  {id: 'c13_p1_002', type: 'static', audio: 'audio/179.mp3'},
                  {id: 'c13_p1_003', type: 'static', audio: 'audio/180.mp3'},
                  {id: 'c13_p1_004', type: 'static', audio: 'audio/181.mp3'},
                  {id: 'c13_p1_005', type: 'static', audio: 'audio/182.mp3'},
                  {id: 'c13_p1_006', type: 'static', audio: 'audio/183.mp3'},
                  {id: 'c13_p1_007', type: 'static', audio: 'audio/184.mp3'} /* 184 */

            ]
        },
		
        'c14_p1': {
            id: 'c14_p1',
            label: '科院内会',
            path: 'pages/bi_ipadtut_c14_p1.html',
            slides: [
                 
                  {id: 'c14_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 185 */
                  {id: 'c14_p1_002', type: 'interactive', audio: 'audio/186.mp3'},
                  {id: 'c14_p1_003', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_004', type: 'interactive', audio: 'audio/188.mp3'},
                  {id: 'c14_p1_005', type: 'interactive', audio: 'audio/189.mp3'},
                  {id: 'c14_p1_006', type: 'interactive', audio: 'audio/190.mp3'},
                  {id: 'c14_p1_007', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_008', type: 'interactive', audio: 'audio/192.mp3'},
                  {id: 'c14_p1_009', type: 'interactive', audio: 'audio/193.mp3'},
                  {id: 'c14_p1_010', type: 'interactive', audio: 'audio/194.mp3'}
                  // {id: 'c14_p1_011', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c14_p1_012', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c14_p1_013', type: 'static', audio: 'audio/00.mp3'},
                  // {id: 'c14_p1_014', type: 'interactive', audio: 'audio/198-199.mp3'},
                  // {id: 'c14_p1_015', type: 'interactive', audio: 'audio/00.mp3'},
                  // {id: 'c14_p1_016', type: 'interactive', audio: 'audio/200.mp3'},
                  // {id: 'c14_p1_017', type: 'interactive', audio: 'audio/201.mp3'} /* 201 */

            ]
        },

        'c14_p2': {
            id: 'c14_p2',
            label: '科院内会',
            path: 'pages/bi_ipadtut_c14_p2.html',
            slides: [

                  {id: 'c14_p1_011', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_012', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_013', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_014', type: 'interactive', audio: 'audio/198-199.mp3'},
                  {id: 'c14_p1_015', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c14_p1_016', type: 'interactive', audio: 'audio/200.mp3'},
                  {id: 'c14_p1_017', type: 'interactive', audio: 'audio/201.mp3'} /* 201 */

            ]
        },
		
        'c15_p1': {
            id: 'c15_p1',
            label: '区域外时间管理',
            path: 'pages/bi_ipadtut_c15_p1.html',
            slides: [
                 
                  {id: 'c15_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 202 */
                  {id: 'c15_p1_002', type: 'interactive', audio: 'audio/203.mp3'},
                  {id: 'c15_p1_003', type: 'interactive', audio: 'audio/204.mp3'},
                  {id: 'c15_p1_004', type: 'interactive', audio: 'audio/205.mp3'},
                  {id: 'c15_p1_005', type: 'interactive', audio: 'audio/206.mp3'},
                  {id: 'c15_p1_006', type: 'interactive', audio: 'audio/207.mp3'},
                  {id: 'c15_p1_007', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c15_p1_008', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c15_p1_009', type: 'interactive', audio: 'audio/210.mp3'},
                  {id: 'c15_p1_010', type: 'interactive', audio: 'audio/211.mp3'},
                  {id: 'c15_p1_011', type: 'interactive', audio: 'audio/212.mp3'},
                  {id: 'c15_p1_012', type: 'interactive', audio: 'audio/213.mp3'},
                  {id: 'c15_p1_013', type: 'interactive', audio: 'audio/214.mp3'},
                  {id: 'c15_p1_014', type: 'interactive', audio: 'audio/215.mp3'},
                  {id: 'c15_p1_015', type: 'interactive', audio: 'audio/216.mp3'} /* 216 */
            ]
        },	

        'c16_p1': {
            id: 'c16_p1',
            label: '辅导拜访',
            path: 'pages/bi_ipadtut_c16_p1.html',
            slides: [
                 
                  {id: 'c16_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 217 */
                  {id: 'c16_p1_002', type: 'static', audio: 'audio/218.mp3'},
                  {id: 'c16_p1_003', type: 'static', audio: 'audio/219.mp3'},
                  {id: 'c16_p1_004', type: 'interactive', audio: 'audio/220.mp3'},
                  {id: 'c16_p1_005', type: 'interactive', audio: 'audio/221.mp3'},
                  {id: 'c16_p1_006', type: 'interactive', audio: 'audio/222.mp3'},
                  {id: 'c16_p1_007', type: 'interactive', audio: 'audio/223.mp3'},
                  {id: 'c16_p1_008', type: 'interactive', audio: 'audio/224.mp3'},
                  {id: 'c16_p1_009', type: 'interactive', audio: 'audio/225.mp3'},
                  {id: 'c16_p1_010', type: 'interactive', audio: 'audio/226.mp3'}
                  // {id: 'c16_p1_011', type: 'interactive', audio: 'audio/227.mp3'},
                  // {id: 'c16_p1_012', type: 'interactive', audio: 'audio/228.mp3'},
                  // {id: 'c16_p1_013', type: 'interactive', audio: 'audio/229.mp3'},
                  // {id: 'c16_p1_014', type: 'interactive', audio: 'audio/230.mp3'},
                  // {id: 'c16_p1_015', type: 'interactive', audio: 'audio/231.mp3'},
                  // {id: 'c16_p1_016', type: 'interactive', audio: 'audio/232.mp3'},
                  // {id: 'c16_p1_017', type: 'interactive', audio: 'audio/233.mp3'},
                  // {id: 'c16_p1_018', type: 'interactive', audio: 'audio/234.mp3'},
                  // {id: 'c16_p1_019', type: 'interactive', audio: 'audio/235.mp3'},
                  // {id: 'c16_p1_020', type: 'interactive', audio: 'audio/236.mp3'},
                  // {id: 'c16_p1_021', type: 'interactive', audio: 'audio/237.mp3'},
                  // {id: 'c16_p1_022', type: 'interactive', audio: 'audio/238.mp3'},
                  // {id: 'c16_p1_023', type: 'interactive', audio: 'audio/239.mp3'},
                  // {id: 'c16_p1_024', type: 'interactive', audio: 'audio/240.mp3'},
                  // {id: 'c16_p1_025', type: 'interactive', audio: 'audio/241.mp3'},
                  // {id: 'c16_p1_026', type: 'interactive', audio: 'audio/242.mp3'},
                  // {id: 'c16_p1_027', type: 'interactive', audio: 'audio/243.mp3'},
                  // {id: 'c16_p1_028', type: 'interactive', audio: 'audio/244.mp3'} /* 244 */
            ]
        },
		
        'c16_p2': {
            id: 'c16_p2',
            label: '辅导拜访',
            path: 'pages/bi_ipadtut_c16_p2.html',
            slides: [
                 
                  {id: 'c16_p1_011', type: 'interactive', audio: 'audio/227.mp3'},
                  {id: 'c16_p1_012', type: 'interactive', audio: 'audio/228.mp3'},
                  {id: 'c16_p1_013', type: 'interactive', audio: 'audio/229.mp3'},
                  {id: 'c16_p1_014', type: 'interactive', audio: 'audio/230.mp3'},
                  {id: 'c16_p1_015', type: 'interactive', audio: 'audio/231.mp3'},
                  {id: 'c16_p1_016', type: 'interactive', audio: 'audio/232.mp3'},
                  {id: 'c16_p1_017', type: 'interactive', audio: 'audio/233.mp3'},
                  {id: 'c16_p1_018', type: 'interactive', audio: 'audio/234.mp3'},
                  {id: 'c16_p1_019', type: 'interactive', audio: 'audio/235.mp3'},
                  {id: 'c16_p1_020', type: 'interactive', audio: 'audio/236.mp3'}
            ]
        },		

        'c16_p3': {
            id: 'c16_p3',
            label: '辅导拜访',
            path: 'pages/bi_ipadtut_c16_p3.html',
            slides: [

                  {id: 'c16_p1_021', type: 'interactive', audio: 'audio/237.mp3'},
                  {id: 'c16_p1_022', type: 'interactive', audio: 'audio/238.mp3'},
                  {id: 'c16_p1_023', type: 'interactive', audio: 'audio/239.mp3'},
                  {id: 'c16_p1_024', type: 'interactive', audio: 'audio/240.mp3'},
                  {id: 'c16_p1_025', type: 'interactive', audio: 'audio/241.mp3'},
                  {id: 'c16_p1_026', type: 'interactive', audio: 'audio/242.mp3'},
                  {id: 'c16_p1_027', type: 'interactive', audio: 'audio/243.mp3'},
                  {id: 'c16_p1_028', type: 'interactive', audio: 'audio/244.mp3'} /* 244 */
            ]
        },	
		
        'c17_p1': {
            id: 'c17_p1',
            label: '实地辅导代表',
            path: 'pages/bi_ipadtut_c17_p1.html',
            slides: [
                 
                  {id: 'c17_p1_001', type: 'static', audio: 'audio/245.mp3'}, /* 245 */
                  {id: 'c17_p1_002', type: 'interactive', audio: 'audio/246.mp3'},
                  {id: 'c17_p1_003', type: 'interactive', audio: 'audio/00.mp3'},
                  {id: 'c17_p1_004', type: 'interactive', audio: 'audio/248.mp3'},
                  {id: 'c17_p1_005', type: 'interactive', audio: 'audio/249.mp3'},
                  {id: 'c17_p1_006', type: 'interactive', audio: 'audio/250.mp3'},
                  {id: 'c17_p1_007', type: 'interactive', audio: 'audio/251.mp3'},
                  {id: 'c17_p1_008', type: 'interactive', audio: 'audio/252.mp3'},
                  {id: 'c17_p1_009', type: 'interactive', audio: 'audio/253.mp3'},
                  {id: 'c17_p1_010', type: 'interactive', audio: 'audio/254.mp3'}
                  // {id: 'c17_p1_011', type: 'interactive', audio: 'audio/255.mp3'},
                  // {id: 'c17_p1_012', type: 'interactive', audio: 'audio/256.mp3'},
                  // {id: 'c17_p1_013', type: 'interactive', audio: 'audio/257.mp3'},
                  // {id: 'c17_p1_014', type: 'interactive', audio: 'audio/258.mp3'},
                  // {id: 'c17_p1_015', type: 'interactive', audio: 'audio/259.mp3'},
                  // {id: 'c17_p1_016', type: 'interactive', audio: 'audio/260.mp3'},
                  // {id: 'c17_p1_017', type: 'interactive', audio: 'audio/261.mp3'},
                  // {id: 'c17_p1_018', type: 'interactive', audio: 'audio/262.mp3'},
                  // {id: 'c17_p1_019', type: 'interactive', audio: 'audio/263.mp3'},
                  // {id: 'c17_p1_020', type: 'interactive', audio: 'audio/264.mp3'},
                  // {id: 'c17_p1_021', type: 'interactive', audio: 'audio/265.mp3'},
                  // {id: 'c17_p1_022', type: 'interactive', audio: 'audio/266.mp3'},
                  // {id: 'c17_p1_023', type: 'interactive', audio: 'audio/267.mp3'},
                  // {id: 'c17_p1_024', type: 'interactive', audio: 'audio/268.mp3'},
                  // {id: 'c17_p1_025', type: 'interactive', audio: 'audio/269.mp3'},
                  // {id: 'c17_p1_026', type: 'interactive', audio: 'audio/270.mp3'},
                  // {id: 'c17_p1_027', type: 'interactive', audio: 'audio/271.mp3'},
                  // {id: 'c17_p1_028', type: 'interactive', audio: 'audio/272.mp3'},
                  // {id: 'c17_p1_029', type: 'interactive', audio: 'audio/273.mp3'},
                  // {id: 'c17_p1_030', type: 'interactive', audio: 'audio/274.mp3'},
                  // {id: 'c17_p1_031', type: 'interactive', audio: 'audio/275.mp3'} /* 275 */
            ]
        },
		
        'c17_p2': {
            id: 'c17_p2',
            label: '实地辅导代表',
            path: 'pages/bi_ipadtut_c17_p2.html',
            slides: [

                  {id: 'c17_p1_011', type: 'interactive', audio: 'audio/255.mp3'},
                  {id: 'c17_p1_012', type: 'interactive', audio: 'audio/256.mp3'},
                  {id: 'c17_p1_013', type: 'interactive', audio: 'audio/257.mp3'},
                  {id: 'c17_p1_014', type: 'interactive', audio: 'audio/258.mp3'},
                  {id: 'c17_p1_015', type: 'interactive', audio: 'audio/259.mp3'},
                  {id: 'c17_p1_016', type: 'interactive', audio: 'audio/260.mp3'},
                  {id: 'c17_p1_017', type: 'interactive', audio: 'audio/261.mp3'},
                  {id: 'c17_p1_018', type: 'interactive', audio: 'audio/262.mp3'},
                  {id: 'c17_p1_019', type: 'interactive', audio: 'audio/263.mp3'},
                  {id: 'c17_p1_020', type: 'interactive', audio: 'audio/264.mp3'}
            ]
        },
		
        'c17_p3': {
            id: 'c17_p3',
            label: '实地辅导代表',
            path: 'pages/bi_ipadtut_c17_p3.html',
            slides: [

                  {id: 'c17_p1_021', type: 'interactive', audio: 'audio/265.mp3'},
                  {id: 'c17_p1_022', type: 'interactive', audio: 'audio/266.mp3'},
                  {id: 'c17_p1_023', type: 'interactive', audio: 'audio/267.mp3'},
                  {id: 'c17_p1_024', type: 'interactive', audio: 'audio/268.mp3'},
                  {id: 'c17_p1_025', type: 'interactive', audio: 'audio/269.mp3'},
                  {id: 'c17_p1_026', type: 'interactive', audio: 'audio/270.mp3'},
                  {id: 'c17_p1_027', type: 'interactive', audio: 'audio/271.mp3'},
                  {id: 'c17_p1_028', type: 'interactive', audio: 'audio/272.mp3'},
                  {id: 'c17_p1_029', type: 'interactive', audio: 'audio/273.mp3'},
                  {id: 'c17_p1_030', type: 'interactive', audio: 'audio/274.mp3'},
                  {id: 'c17_p1_031', type: 'interactive', audio: 'audio/275.mp3'} /* 275 */
            ]
        },
		
        'c18_p1': {
            id: 'c18_p1',
            label: '报告',
            path: 'pages/bi_ipadtut_c18_p1.html',
            slides: [
                 
                  {id: 'c18_p1_001', type: 'static', audio: 'audio/00.mp3'}, /* 276 */
                  {id: 'c18_p1_002', type: 'static', audio: 'audio/277.mp3'},
                  {id: 'c18_p1_003', type: 'static', audio: 'audio/00.mp3'},
                  {id: 'c18_p1_004', type: 'static', audio: 'audio/00.mp3'} /* 279 */
            ]
        }		
    }
};