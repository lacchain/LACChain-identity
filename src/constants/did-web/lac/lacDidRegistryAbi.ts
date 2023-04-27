export const LAC_DIDREGISTRY_RECOVERABLE_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minKeyRotationTime',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'name',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'value',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'validTo',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousChange',
        type: 'uint256'
      }
    ],
    name: 'DIDAttributeChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'controller',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousChange',
        type: 'uint256'
      }
    ],
    name: 'DIDControllerChanged',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'controller',
        type: 'address'
      }
    ],
    name: 'addController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'newController',
        type: 'address'
      }
    ],
    name: 'changeController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: 'sigV',
        type: 'uint8'
      },
      {
        internalType: 'bytes32',
        name: 'sigR',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'sigS',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'newController',
        type: 'address'
      }
    ],
    name: 'changeControllerSigned',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'changed',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'controllers',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      }
    ],
    name: 'disableKeyRotation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'keyRotationTime',
        type: 'uint256'
      }
    ],
    name: 'enableKeyRotation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'subject',
        type: 'address'
      }
    ],
    name: 'getControllers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      }
    ],
    name: 'identityController',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'nonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'controller',
        type: 'address'
      }
    ],
    name: 'removeController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes'
      }
    ],
    name: 'revokeAttribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: 'sigV',
        type: 'uint8'
      },
      {
        internalType: 'bytes32',
        name: 'sigR',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'sigS',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes'
      }
    ],
    name: 'revokeAttributeSigned',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'validity',
        type: 'uint256'
      }
    ],
    name: 'setAttribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'identity',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: 'sigV',
        type: 'uint8'
      },
      {
        internalType: 'bytes32',
        name: 'sigR',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'sigS',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: 'name',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'validity',
        type: 'uint256'
      }
    ],
    name: 'setAttributeSigned',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
