export default {
  'headers': [
    'Years in Activity_Date',
    'Quarters in Activity_Date',
    'Months in Activity_Date',
    'Weeks in Activity_Date',
    'SaleType',
    'AgeRange',
    'Average Items_Sold',
    '# of unique Gender',
  ],
  'metadata': [
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Activity_Date',
        'dim': '[ActivityFull.Activity_Date (Calendar)]',
        'datatype': 'datetime',
        'level': 'years',
        'title': 'Years in Activity_Date',
      },
      'format': {
        'mask': {
          'years': 'yyyy',
          'quarters': 'yyyy Q',
          'months': 'MM/yyyy',
          'weeks': 'ww yyyy',
          'days': 'shortDate',
          'isdefault': true,
        },
        'subtotal': true,
      },
      'field': {
        'id': '[ActivityFull.Activity_Date (Calendar)]_years',
        'index': 0,
      },
      'hierarchies': [
        'calendar',
        'calendar - weeks',
      ],
      'panel': 'rows',
      'handlers': [
                {},
      ],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Activity_Date',
        'dim': '[ActivityFull.Activity_Date (Calendar)]',
        'datatype': 'datetime',
        'level': 'quarters',
        'title': 'Quarters in Activity_Date',
      },
      'format': {
        'mask': {
          'years': 'yyyy',
          'quarters': 'yyyy Q',
          'months': 'MM/yyyy',
          'weeks': 'ww yyyy',
          'days': 'shortDate',
          'isdefault': true,
        },
      },
      'field': {
        'id': '[ActivityFull.Activity_Date (Calendar)]_quarters',
        'index': 1,
      },
      'hierarchies': [
        'calendar',
        'calendar - weeks',
      ],
      'panel': 'rows',
      'handlers': [
                {},
      ],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Activity_Date',
        'dim': '[ActivityFull.Activity_Date (Calendar)]',
        'datatype': 'datetime',
        'merged': true,
        'level': 'months',
        'title': 'Months in Activity_Date',
      },
      'format': {
        'mask': {
          'years': 'yyyy',
          'quarters': 'yyyy Q',
          'months': 'MM/yyyy',
          'weeks': 'ww yyyy',
          'days': 'shortDate',
          'isdefault': true,
        },
        'width': 153,
      },
      'hierarchies': [
        'calendar',
        'calendar - weeks',
      ],
      'field': {
        'id': '[ActivityFull.Activity_Date (Calendar)]_months',
        'index': 2,
      },
      'panel': 'rows',
      'handlers': [
                {},
      ],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Activity_Date',
        'dim': '[ActivityFull.Activity_Date (Calendar)]',
        'datatype': 'datetime',
        'merged': true,
        'level': 'weeks',
        'firstday': 'mon',
        'title': 'Weeks in Activity_Date',
      },
      'format': {
        'mask': {
          'years': 'yyyy',
          'quarters': 'yyyy Q',
          'months': 'MM/yyyy',
          'weeks': 'ww yyyy',
          'days': 'shortDate',
          'isdefault': true,
        },
        'width': 88,
      },
      'hierarchies': [
        'calendar',
        'calendar - weeks',
      ],
      'field': {
        'id': '[ActivityFull.Activity_Date (Calendar)]_weeks',
        'index': 3,
      },
      'panel': 'rows',
      'handlers': [
                {},
      ],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'SaleType',
        'dim': '[ActivityFull.SaleType]',
        'datatype': 'text',
        'title': 'SaleType',
      },
      'field': {
        'id': '[ActivityFull.SaleType]',
        'index': 4,
      },
      'disabled': false,
      'panel': 'columns',
      'handlers': [],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'AgeRange',
        'dim': '[ActivityFull.AgeRange]',
        'datatype': 'text',
        'merged': true,
        'title': 'AgeRange',
      },
      'field': {
        'id': '[ActivityFull.AgeRange]',
        'index': 5,
      },
      'disabled': false,
      'panel': 'columns',
      'handlers': [],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Items_Sold',
        'dim': '[ActivityFull.Items_Sold]',
        'datatype': 'numeric',
        'agg': 'avg',
        'title': 'Average Items_Sold',
      },
      'format': {
        'mask': {
          'abbreviations': {
            't': false,
            'b': false,
            'm': false,
            'k': false,
          },
          'decimals': '4',
          'number': {
            'separated': true,
          },
        },
        'color': {
          'type': 'color',
          'color': 'transparent',
        },
        'databars': true,
        'width': 114,
      },
      'field': {
        'id': '[ActivityFull.Items_Sold]_avg',
        'index': 6,
        'min': 0,
        'max': 2,
      },
      'panel': 'measures',
      'handlers': [
                {},
                {},
      ],
    },
    {
      'jaql': {
        'table': 'ActivityFull',
        'column': 'Gender',
        'dim': '[ActivityFull.Gender]',
        'datatype': 'text',
        'title': '# of unique Gender',
        'agg': 'count',
      },
      'field': {
        'id': '[ActivityFull.Gender]_count',
        'index': 7,
      },
      'format': {
        'mask': {
          'type': 'number',
          't': true,
          'b': true,
          'separated': true,
          'decimals': 'auto',
          'isdefault': true,
        },
        'color': {
          'type': 'color',
          'color': 'transparent',
        },
        'width': 73,
      },
      'panel': 'measures',
      'handlers': [
                {},
                {},
      ],
    },
  ],
  'datasource': {
    'fullname': 'LocalHost/ActivityFull',
    'revisionId': '8e19976c-ec62-4e36-acf0-b9ed177b9fb7',
  },
  'values': [
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': 'N\\A',
        'text': 'N\\A',
      },
      {
        'data': 0.1643835616438356,
        'text': '0.164383561643836',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '0-18',
        'text': '0-18',
      },
      {
        'data': 0,
        'text': '0',
      },
      {
        'data': 1,
        'text': '1',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '19-24',
        'text': '19-24',
      },
      {
        'data': 0.42857142857142855,
        'text': '0.428571428571429',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '25-34',
        'text': '25-34',
      },
      {
        'data': 0.09090909090909091,
        'text': '0.0909090909090909',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '35-44',
        'text': '35-44',
      },
      {
        'data': 0.03225806451612903,
        'text': '0.032258064516129',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '45-54',
        'text': '45-54',
      },
      {
        'data': 0.06896551724137931,
        'text': '0.0689655172413793',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '55-64',
        'text': '55-64',
      },
      {
        'data': 0.16666666666666666,
        'text': '0.166666666666667',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '65+',
        'text': '65+',
      },
      {
        'data': 0.12903225806451613,
        'text': '0.129032258064516',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': 'N\\A',
        'text': 'N\\A',
      },
      {
        'data': 0.16487455197132617,
        'text': '0.164874551971326',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '19-24',
        'text': '19-24',
      },
      {
        'data': 0,
        'text': '0',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '25-34',
        'text': '25-34',
      },
      {
        'data': 0.1,
        'text': '0.1',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '35-44',
        'text': '35-44',
      },
      {
        'data': 0.06451612903225806,
        'text': '0.0645161290322581',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '45-54',
        'text': '45-54',
      },
      {
        'data': 0.17647058823529413,
        'text': '0.176470588235294',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '55-64',
        'text': '55-64',
      },
      {
        'data': 0.12,
        'text': '0.12',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-11-26T00:00:00',
        'text': '48 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '65+',
        'text': '65+',
      },
      {
        'data': 0.1875,
        'text': '0.1875',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': 'N\\A',
        'text': 'N\\A',
      },
      {
        'data': 0.11940298507462686,
        'text': '0.119402985074627',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '19-24',
        'text': '19-24',
      },
      {
        'data': 0.25,
        'text': '0.25',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '25-34',
        'text': '25-34',
      },
      {
        'data': 0.2,
        'text': '0.2',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '35-44',
        'text': '35-44',
      },
      {
        'data': 0,
        'text': '0',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '45-54',
        'text': '45-54',
      },
      {
        'data': 0.125,
        'text': '0.125',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '55-64',
        'text': '55-64',
      },
      {
        'data': 0,
        'text': '0',
      },
      {
        'data': 1,
        'text': '1',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Auction',
        'text': 'Auction',
      },
      {
        'data': '65+',
        'text': '65+',
      },
      {
        'data': 0.16666666666666666,
        'text': '0.166666666666667',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': 'N\\A',
        'text': 'N\\A',
      },
      {
        'data': 0.29411764705882354,
        'text': '0.294117647058824',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '19-24',
        'text': '19-24',
      },
      {
        'data': 1,
        'text': '1',
      },
      {
        'data': 1,
        'text': '1',
      },
    ],
    [
      {
        'data': '2009-01-01T00:00:00',
        'text': '2009',
      },
      {
        'data': '2009-10-01T00:00:00',
        'text': '2009 Q4',
      },
      {
        'data': '2009-11-01T00:00:00',
        'text': '11/2009',
      },
      {
        'data': '2009-12-03T00:00:00',
        'text': '49 2009',
      },
      {
        'data': 'Fixed Price',
        'text': 'Fixed Price',
      },
      {
        'data': '25-34',
        'text': '25-34',
      },
      {
        'data': 0,
        'text': '0',
      },
      {
        'data': 2,
        'text': '2',
      },
    ],
  ],
}
