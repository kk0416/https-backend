import { createRouter, createWebHistory } from 'vue-router';

import AppShell from '../shell/AppShell.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppShell,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: {
            title: '概览总览',
            icon: 'DataBoard',
            description: '检查健康状态、统计概览和后端连接信息',
          },
        },
        {
          path: 'data-assets',
          name: 'data-assets',
          component: () => import('../views/DataAssetsView.vue'),
          meta: {
            title: '数据管理',
            icon: 'Files',
            description: '测试数据资产列表、任务列表和点云生成接口',
          },
        },
        {
          path: 'visualization',
          name: 'visualization',
          component: () => import('../views/VisualizationView.vue'),
          meta: {
            title: '运行可视化',
            icon: 'Share',
            description: '查看树状视图和节点关系图',
          },
        },
      ],
    },
  ],
});

export default router;
