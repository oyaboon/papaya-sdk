export const Papaya = [
    {
      inputs: [
        {
          internalType: "address",
          name: "CHAIN_PRICE_FEED_",
          type: "address",
        },
        {
          internalType: "address",
          name: "TOKEN_PRICE_FEED_",
          type: "address",
        },
        {
          internalType: "address",
          name: "TOKEN_",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "AccessDenied",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "AddressInsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "DeadlineExceeded",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "EnumerableMapNonexistentKey",
      type: "error",
    },
    {
      inputs: [],
      name: "ExcessOfRate",
      type: "error",
    },
    {
      inputs: [],
      name: "ExcessOfSubscriptions",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [],
      name: "IndexOutOfBounds",
      type: "error",
    },
    {
      inputs: [],
      name: "InsufficialBalance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "InvalidProjectId",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidShortString",
      type: "error",
    },
    {
      inputs: [],
      name: "NotLegal",
      type: "error",
    },
    {
      inputs: [],
      name: "NotLiquidatable",
      type: "error",
    },
    {
      inputs: [],
      name: "NotSubscribed",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [],
      name: "Permit2TransferAmountTooHigh",
      type: "error",
    },
    {
      inputs: [],
      name: "ReduceTheAmount",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "SafeCastOverflowedUintToInt",
      type: "error",
    },
    {
      inputs: [],
      name: "SafeTransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "SafeTransferFromFailed",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "str",
          type: "string",
        },
      ],
      name: "StringTooLong",
      type: "error",
    },
    {
      inputs: [],
      name: "TopUpBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongNonce",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongNonceType",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongPercent",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongRelayer",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongSignature",
      type: "error",
    },
    {
      inputs: [],
      name: "WrongToken",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [],
      name: "EIP712DomainChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "liquidator",
          type: "address",
        },
      ],
      name: "Liquidated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "admin",
          type: "address",
        },
      ],
      name: "ProjectIdClaimed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Refill",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "protocolFee",
          type: "uint16",
        },
      ],
      name: "SetDefaultSettings",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "protocolFee",
          type: "uint16",
        },
      ],
      name: "SetSettingsForUser",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "author",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "encodedRates",
          type: "uint256",
        },
      ],
      name: "StreamCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "author",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "encodedRates",
          type: "uint256",
        },
      ],
      name: "StreamRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "APPROX_LIQUIDATE_GAS",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "APPROX_SUBSCRIPTION_GAS",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "COIN_PRICE_FEED",
      outputs: [
        {
          internalType: "contract AggregatorV3Interface",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DECIMALS_SCALE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FLOOR",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_PROTOCOL_FEE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "REFILL_DAYS",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "SIGNED_CALL_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "SUBSCRIPTION_THRESHOLD",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "TOKEN",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "TOKEN_PRICE_FEED",
      outputs: [
        {
          internalType: "contract AggregatorV3Interface",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "TRANSFER_GAS_COST",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "allProjectOwners",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
      ],
      name: "allSubscriptions",
      outputs: [
        {
          internalType: "address[]",
          name: "to",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "encodedRates",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
        {
          components: [
            {
              internalType: "BySigTraits.Value",
              name: "traits",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          internalType: "struct BySig.SignedCall",
          name: "sig",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "bySig",
      outputs: [
        {
          internalType: "bytes",
          name: "ret",
          type: "bytes",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "bySigAccountNonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "bytes4",
          name: "selector",
          type: "bytes4",
        },
      ],
      name: "bySigSelectorNonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
      ],
      name: "bySigUniqueNonces",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
      ],
      name: "bySigUniqueNoncesSlot",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "projectOwner",
          type: "address",
        },
      ],
      name: "claimProjectId",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "defaultSettings",
      outputs: [
        {
          internalType: "bool",
          name: "initialized",
          type: "bool",
        },
        {
          internalType: "uint16",
          name: "projectFee",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isPermit2",
          type: "bool",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "bool",
          name: "isPermit2",
          type: "bool",
        },
      ],
      name: "depositFor",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        {
          internalType: "bytes1",
          name: "fields",
          type: "bytes1",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "version",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifyingContract",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "uint256[]",
          name: "extensions",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "BySigTraits.Value",
              name: "traits",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          internalType: "struct BySig.SignedCall",
          name: "sig",
          type: "tuple",
        },
      ],
      name: "hashBySig",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "liquidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      name: "multicall",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "pay",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "permit",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "action",
          type: "bytes",
        },
      ],
      name: "permitAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "projectOwners",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "rescueFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "bool",
              name: "initialized",
              type: "bool",
            },
            {
              internalType: "uint16",
              name: "projectFee",
              type: "uint16",
            },
          ],
          internalType: "struct IPapaya.Settings",
          name: "settings",
          type: "tuple",
        },
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "setDefaultSettings",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          components: [
            {
              internalType: "bool",
              name: "initialized",
              type: "bool",
            },
            {
              internalType: "uint16",
              name: "projectFee",
              type: "uint16",
            },
          ],
          internalType: "struct IPapaya.Settings",
          name: "settings",
          type: "tuple",
        },
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "setSettingsForUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "extraData",
          type: "bytes",
        },
      ],
      name: "sponsoredCall",
      outputs: [
        {
          internalType: "bytes",
          name: "ret",
          type: "bytes",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "author",
          type: "address",
        },
        {
          internalType: "uint96",
          name: "subscriptionRate",
          type: "uint96",
        },
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
      ],
      name: "subscribe",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "subscriptions",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "encodedRates",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "author",
          type: "address",
        },
      ],
      name: "unsubscribe",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "advance",
          type: "uint32",
        },
      ],
      name: "useBySigAccountNonce",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "selector",
          type: "bytes4",
        },
        {
          internalType: "uint32",
          name: "advance",
          type: "uint32",
        },
      ],
      name: "useBySigSelectorNonce",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
      ],
      name: "useBySigUniqueNonce",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "userSettings",
      outputs: [
        {
          internalType: "bool",
          name: "initialized",
          type: "bool",
        },
        {
          internalType: "uint16",
          name: "projectFee",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "users",
      outputs: [
        {
          internalType: "int256",
          name: "balance",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "incomeRate",
          type: "int256",
        },
        {
          internalType: "int256",
          name: "outgoingRate",
          type: "int256",
        },
        {
          internalType: "uint256",
          name: "updated",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdrawTo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;
  