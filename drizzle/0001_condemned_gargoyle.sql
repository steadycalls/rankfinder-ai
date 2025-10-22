CREATE TABLE `credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`credits` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`niche` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`opportunityScore` int NOT NULL,
	`searchVolume` int NOT NULL,
	`avgCpc` int NOT NULL,
	`competitionLevel` varchar(50) NOT NULL,
	`keywords` text NOT NULL,
	`competitors` text NOT NULL,
	`domains` text NOT NULL,
	`revenueProjection` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
