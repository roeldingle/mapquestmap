CREATE TABLE IF NOT EXISTS `mapquestmap_setting` (
				  `pmq_idx` int(11) NOT NULL auto_increment,
				  `pmq_pm_idx` int(11) NOT NULL,
				  `pmq_title` varchar(250) NOT NULL,
				  `pmq_size` varchar(20) NOT NULL,
				  `pmq_static_map` int(11) NOT NULL,
				  `pmq_locations` text NOT NULL,
				  `pmq_border_width` int(11) NOT NULL,
				  `pmq_border_color` varchar(10) NOT NULL,
				  `pmq_background` varchar(10) NOT NULL,
				  PRIMARY KEY  (`pmq_idx`)
				) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;