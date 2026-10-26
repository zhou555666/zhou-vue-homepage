-- ============================================================
-- 实验五 网络请求与前后端交互
-- 数据库初始化脚本（MySQL 5.7 / utf8mb4）
-- 使用方法：
--   mysql -uroot -p < init.sql
-- 执行前请确保本机 MySQL 已启动。
-- ============================================================

CREATE DATABASE IF NOT EXISTS vue_homepage
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE vue_homepage;

-- ---------- 项目表 ----------
-- id       主键，自增
-- title    项目标题（必填）
-- role     项目角色
-- status   项目状态（规划中/开发中/已完成，亦可由起止时间推导）
-- start_time / end_time  起止月份（YYYY-MM）
-- `desc`   项目描述
-- is_star  是否代表作（0 否 / 1 是）
-- techs    技术栈（JSON 数组）
-- detail   项目详情
-- stages   项目进程阶段（JSON 数组）
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  role        VARCHAR(50)  DEFAULT '',
  status      VARCHAR(20)  DEFAULT '规划中',
  start_time  VARCHAR(20)  DEFAULT '',
  end_time    VARCHAR(20)  DEFAULT '',
  `desc`      TEXT,
  is_star     TINYINT(1)   DEFAULT 0,
  techs       JSON,
  detail      TEXT,
  stages      JSON,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- 文章表 ----------
-- id       主键，自增
-- title    文章标题（必填）
-- category 文章分类
-- summary  摘要
-- content  正文
-- date     发布日期
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  category    VARCHAR(50)  DEFAULT '随笔',
  summary     VARCHAR(500) DEFAULT '',
  content     TEXT,
  date        VARCHAR(20)  DEFAULT '',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- 示例数据（对应实验四的默认数据） ----------
INSERT INTO projects
  (id, title, role, status, start_time, end_time, `desc`, is_star, techs, detail, stages)
VALUES
  (1, '大学生积分管理系统', '后端开发', '已完成', '2025-11', '2026-01',
   '面向大学生社团活动的积分记录与排行系统，实现活动发布、积分录入与统计展示。', 1,
   JSON_ARRAY('Vue3', 'JavaScript', 'HTML', 'CSS'),
   '负责积分记录模块的接口对接与页面展示，实现了按活动、按成员的积分汇总。',
   JSON_ARRAY(JSON_OBJECT('name', '第一阶段', 'start', '2025-11', 'duration', '2个月'))),
  (2, '互联网专家服务平台', '前端开发', '开发中', '2026-04', '2026-06',
   '面向专家的在线咨询服务门户，包含专家列表、服务介绍与预约入口。', 0,
   JSON_ARRAY('JavaScript', 'CSS'),
   '负责专家展示页与预约流程的前端实现。',
   JSON_ARRAY());

INSERT INTO articles
  (id, title, category, summary, content, date)
VALUES
  (1, '我的第一个 Vue 项目', '学习笔记', '记录从搭建 Vite 脚手架到完成个人主页与路由配置的过程。',
   '通过本次实验，我完成了个人主页的搭建，掌握了 Vue 单文件组件、路由配置与组件通信的基本用法。', '2026-10-01'),
  (2, '理解 Vue Router 路由体系', '技术分享', '梳理基础路由、嵌套路由与动态路由的区别与使用场景。',
   '本文整理了 Vue Router 中 path、name、component、children、meta 等配置项，以及 RouterView 作为路由出口的渲染机制。', '2026-10-08');
