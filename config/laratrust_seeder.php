<?php

return [
    /**
     * Control if the seeder should create a user per role while seeding the data.
     */
    'create_users' => false,

    /**
     * Control if all the laratrust tables should be truncated before running the seeder.
     */
    'truncate_tables' => true,

    'roles_structure' => [
        'admin' => [
            'users' => 'c,r,u,d',
            'fabricstocks' => 'c,r,u,d',
            'warehouse' => 'c,r,u,d',
            'transportercard' => 'c,r,u,d',
            'sale-records' => 'c',
        ],
        'StockOwner' => [
            'fabricstocks' => 'c,r,u,d',
            'warehouse' => 'r',
            'transportercard' => 'r',
            'sale-records' => 'c',
        ],
        'WarehouseProvider' => [
            'warehouse' => 'c,r,u,d',
            'sale-records' => 'c',
        ],
        'Transporter' => [
            'transportercard' => 'c,r,u,d',
            'sale-records' => 'c',
        ],
        'customer' => [
            'fabricstocks' => 'r',
            'warehouse' => 'r',
            'transportercard' => 'r',
            'sale-records' => 'c',
        ],
    ],

    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
