const routesPermissions = [
  {
    parentPath: '/process',
    childRoutes: [
      { path: '', permissions: 'see-process', method: 'GET' },
      { path: '/:idProcess', permissions: 'see-process', method: 'GET' },
      { path: '/newProcess', permissions: 'create-process', method: 'POST' },
      {
        path: '/updateProcess/:idProcess',
        permissions: 'edit-process',
        method: 'PUT',
      },
      {
        path: '/deleteProcess/:idProcess',
        permissions: 'delete-process',
        method: 'DELETE',
      },
      {
        path: '/finalizeProcess/:idProcess',
        permissions: 'end-process',
        method: 'PUT',
      },
      {
        path: '/archiveProcess/:idProcess/:archiveFlag',
        permissions: 'archive-process',
        method: 'PUT',
      },
      { path: '/updateStage', permissions: 'forward-stage', method: 'PUT' },
      {
        path: '/keys/:idFlow/:record',
        permissions: 'see-process',
        method: 'GET',
      },
    ],
  },
  {
    parentPath: '/flow',
    childRoutes: [
      { path: '', permissions: 'see-flow', method: 'GET' },
      { path: '', permissions: 'edit-flow', method: 'PUT' },
      { path: '/newFlow', permissions: 'create-flow', method: 'POST' },
      { path: '/:idFlow', permissions: 'delete-flow', method: 'DELETE' },
    ],
  },
  {
    parentPath: '/stage',
    childRoutes: [
      { path: '', permissions: 'see-stage', method: 'GET' },
      { path: '/:idStage', permissions: 'see-stage', method: 'GET' },
      { path: '/newStage', permissions: 'create-stage', method: 'POST' },
      {
        path: '/deleteStage/:idStage',
        permissions: 'delete-stage',
        method: 'DELETE',
      },
      { path: '/updateStage', permissions: 'edit-stage', method: 'PUT' },
    ],
  },
];

export default routesPermissions;
