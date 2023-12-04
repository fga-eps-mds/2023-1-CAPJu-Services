
const routesPermissions = [
    {
        parentPath: '/sessions',
        childRoutes: [
            { path: '/findAllPaged', permissions: 'manage-user-sessions', method: 'GET' },
            { path: '/logoutAsAdmin/:sessionId', permissions: 'manage-user-sessions', method: 'PATCH' },
        ]
    },
];

export default routesPermissions;

