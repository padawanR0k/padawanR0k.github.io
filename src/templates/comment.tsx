import React, { FunctionComponent } from "react";
// import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
const { Disqus, CommentCount } = require('gatsby-plugin-disqus');
import config from '../website-config';
/**
 * Placeholder which is attached under every post. Can be shadowed to
 * quickly integrate comments (like commento, Disqus, ...).
 */
// @ts-ignore
const Comments: FunctionComponent<{ slug: string, title: string }> = ({ title, slug }) => {
	let disqusConfig = {
		identifier: title,
		// shortname: config.disqusShortname,
		config: {
			url: `${config.siteUrl + slug }`,
			identifier: slug,
			title,
		},
	}
	return (
		<>
			<CommentCount config={disqusConfig} placeholder={'...'} />
			<Disqus config={disqusConfig} />
		</>
	)
};

export default Comments;
