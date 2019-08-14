CREATE TABLE `monpyo` (
	`questionNo` VARCHAR(19) NOT NULL COMMENT '受付No' COLLATE 'utf16_unicode_520_ci',
	`questionDtTm` DATETIME NOT NULL COMMENT '受付日時',
	`questionBelonging` VARCHAR(25) NOT NULL COMMENT '受付所属' COLLATE 'utf16_unicode_520_ci',
	`questionStaff` VARCHAR(25) NOT NULL COMMENT '受付者' COLLATE 'utf16_unicode_520_ci',
	`questionMethod` VARCHAR(6) NULL DEFAULT NULL COMMENT '受付手段' COLLATE 'utf16_unicode_520_ci',
	`questionSituation` VARCHAR(6) NULL DEFAULT NULL COMMENT '受付状況' COLLATE 'utf16_unicode_520_ci',
	`sectionCd` VARCHAR(4) NULL DEFAULT NULL COMMENT '部門コード' COLLATE 'utf16_unicode_520_ci',
	`belonging` VARCHAR(50) NOT NULL COMMENT '所属' COLLATE 'utf16_unicode_520_ci',
	`sender` VARCHAR(25) NULL DEFAULT NULL COMMENT '発信者' COLLATE 'utf16_unicode_520_ci',
	`telNo` VARCHAR(25) NULL DEFAULT NULL COMMENT 'TEL' COLLATE 'utf16_unicode_520_ci',
	`requireKbn` VARCHAR(6) NULL DEFAULT NULL COMMENT '要件区分' COLLATE 'utf16_unicode_520_ci',
	`section` VARCHAR(50) NULL DEFAULT NULL COMMENT '業務名' COLLATE 'utf16_unicode_520_ci',
	`operationName` VARCHAR(255) NOT NULL COMMENT '概要' COLLATE 'utf16_unicode_520_ci',
	`requirement` TEXT NOT NULL COMMENT '内容' COLLATE 'utf16_unicode_520_ci',
	`attachmentFlg` TINYINT(1) NULL DEFAULT '0' COMMENT '添付資料有無',
	`attachmentDoc` VARCHAR(255) NULL DEFAULT NULL COMMENT '添付資料名' COLLATE 'utf16_unicode_520_ci',
	`avoidanceAblity` TINYINT(1) NULL DEFAULT '0' COMMENT '回避策有無',
	`avoidanceMethod` VARCHAR(255) NULL DEFAULT NULL COMMENT '回避策' COLLATE 'utf16_unicode_520_ci',
	`sendDt` DATE NULL DEFAULT NULL COMMENT '問合せ票送付日',
	`answer` TEXT NULL DEFAULT NULL COMMENT '回答内容' COLLATE 'utf16_unicode_520_ci',
	`answerSection` VARCHAR(50) NULL DEFAULT NULL COMMENT '回答者所属' COLLATE 'utf16_unicode_520_ci',
	`answerStaff` VARCHAR(25) NULL DEFAULT NULL COMMENT '回答者' COLLATE 'utf16_unicode_520_ci',
	`approver` VARCHAR(25) NULL DEFAULT NULL COMMENT '承認者' COLLATE 'utf16_unicode_520_ci',
	`expectedDt` DATE NULL DEFAULT NULL COMMENT '回答予定日',
	`answerDtTm` DATETIME NULL DEFAULT NULL COMMENT '回答日時',
	`requiredDays` INT(11) NULL DEFAULT NULL COMMENT '回答日数',
	`termDt` DATE NULL DEFAULT NULL COMMENT '回答期限',
	`settlementDt` DATE NULL DEFAULT NULL COMMENT '完了日',
	`answerDoc` VARCHAR(255) NULL DEFAULT NULL COMMENT '回答添付資料' COLLATE 'utf16_unicode_520_ci',
	`anotherCase` VARCHAR(128) NULL DEFAULT NULL COMMENT '別件で回答済み' COLLATE 'utf16_unicode_520_ci',
	`responseDt` DATE NULL DEFAULT NULL COMMENT '回答書送付',
	`followUpPlanDt` DATE NULL DEFAULT NULL COMMENT '追跡予定日',
	`followUpDt` DATE NULL DEFAULT NULL COMMENT '追跡作業日',
	`verification` VARCHAR(2) NULL DEFAULT NULL COMMENT '追跡検証' COLLATE 'utf16_unicode_520_ci',
	`reportKbn` VARCHAR(5) NULL DEFAULT NULL COMMENT '上申区分' COLLATE 'utf16_unicode_520_ci',
	`authentication` VARCHAR(2) NULL DEFAULT NULL COMMENT '上申確認' COLLATE 'utf16_unicode_520_ci',
	`remarks` TEXT NULL DEFAULT NULL COMMENT '備考' COLLATE 'utf16_unicode_520_ci',
	`approvalDtTm` DATETIME NULL DEFAULT NULL COMMENT '承認日時',
	`daySeqNo` INT(11) NULL DEFAULT NULL COMMENT '同日ID',
	PRIMARY KEY (`questionNo`)
)
COMMENT='問合票管理'
COLLATE='utf16_unicode_520_ci'
ENGINE=InnoDB
;