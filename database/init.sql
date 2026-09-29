-- ============================================================
-- Network Intelligence — схема базы данных
-- Скрипт выполняется автоматически при первом старте MySQL
-- (монтируется в /docker-entrypoint-initdb.d/01-init.sql в compose.yaml).
-- Идемпотентен: все операторы используют IF NOT EXISTS.
-- ============================================================

USE `network_intelligence`;

-- Разовые результаты сканирования
CREATE TABLE IF NOT EXISTS `scans` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `target`           VARCHAR(255)    NOT NULL,
    `data`             JSON            NULL,
    `telegram_user_id` BIGINT          NULL,
    `platform`         VARCHAR(32)     NULL,
    `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_scans_user`    (`telegram_user_id`),
    KEY `idx_scans_created` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Мониторы (активные/остановленные)
CREATE TABLE IF NOT EXISTS `monitors` (
    `id`                          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `target`                      VARCHAR(255)    NOT NULL,
    `interval_minutes`            INT             NOT NULL DEFAULT 5,
    `status`                      VARCHAR(32)     NOT NULL DEFAULT 'active',
    `telegram_user_id`            BIGINT          NULL,
    `type`                        VARCHAR(32)     NOT NULL DEFAULT 'monitor',
    `platform`                    VARCHAR(32)     NULL,
    `send_monitor_notificationsTG`   TINYINT(1)    NOT NULL DEFAULT 0,
    `send_event_notificationsTG`     TINYINT(1)    NOT NULL DEFAULT 0,
    `send_monitor_notificationsMAX`  TINYINT(1)    NOT NULL DEFAULT 0,
    `send_event_notificationsMAX`    TINYINT(1)    NOT NULL DEFAULT 0,
    `created_at`                  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_monitors_user`   (`telegram_user_id`),
    KEY `idx_monitors_status` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Результаты каждого цикла мониторинга
CREATE TABLE IF NOT EXISTS `monitor_results` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `monitor_id` BIGINT UNSIGNED NOT NULL,
    `data`       JSON            NULL,
    `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_mr_monitor` (`monitor_id`, `created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Зафиксированные изменения (события)
CREATE TABLE IF NOT EXISTS `monitor_events` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `monitor_id` BIGINT UNSIGNED NOT NULL,
    `parameter`  VARCHAR(128)    NOT NULL,
    `old_value`  TEXT            NULL,
    `new_value`  TEXT            NULL,
    `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_me_monitor` (`monitor_id`, `created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Пользователи каналов (Telegram / MAX / web)
CREATE TABLE IF NOT EXISTS `telegram_max_web_users` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `telegram_user_id` BIGINT          NULL,
    `telegram_chat_id` BIGINT          NULL,
    `username`         VARCHAR(128)    NULL,
    `platform`         VARCHAR(32)     NOT NULL DEFAULT 'telegram',
    `created_at`       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_tmu_chat_platform` (`telegram_chat_id`, `platform`),
    KEY `idx_tmu_user`         (`telegram_user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Служебная таблица состояния long-polling бота Telegram
CREATE TABLE IF NOT EXISTS `telegram_bot_state` (
    `id`            INT      NOT NULL,
    `last_update_id` BIGINT  NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `telegram_bot_state` (`id`, `last_update_id`) VALUES (1, 0)
    ON DUPLICATE KEY UPDATE `last_update_id` = `last_update_id`;

-- Служебная таблица состояния long-polling бота MAX
CREATE TABLE IF NOT EXISTS `max_bot_state` (
    `id`             INT      NOT NULL,
    `last_update_id` BIGINT   NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO `max_bot_state` (`id`, `last_update_id`) VALUES (1, 0)
    ON DUPLICATE KEY UPDATE `last_update_id` = `last_update_id`;