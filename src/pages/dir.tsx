import { graphql } from 'gatsby';
import React from 'react';
import { FluidObject } from 'gatsby-image';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostCard } from '../components/PostCard';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
	inner,
	outer,
	PostFeed,
	SiteDescription,
	SiteHeader,
	SiteHeaderContent,
	SiteMain,
	SiteTitle,
	SiteNavMain,
	SiteArchiveHeader,
	ResponsiveHeaderBackground,
	SiteHeaderBackground,
} from '../styles/shared';
import { PageContext } from '../templates/post';
import { Helmet } from 'react-helmet';
import config from '../website-config';
import styled from '@emotion/styled';
import { colors } from '../styles/colors';


interface GroupItem {
	fieldValue: string;
	totalCount: number;
}
interface TagTemplateProps {
	location: Location;
	pageContext: {
		tag: string;
	};
	data: {
		allMarkdownRemark: {
			group: Array<GroupItem>;
		};
	};
}

const Tags = ({ pageContext, data, location }: TagTemplateProps) => {
	const tag = pageContext.tag ? pageContext.tag : '';

	return (
		<IndexLayout>
			<Helmet>
				<html lang={config.lang} />
				<title>
					{tag} - {config.title}
				</title>
				{/* <meta name="description" content={tagData?.node ? tagData.node.description : ''} /> */}
				<meta property="og:site_name" content={config.title} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${tag} - ${config.title}`} />
				<meta property="og:url" content={config.siteUrl + location.pathname} />
				{config.facebook && <meta property="article:publisher" content={config.facebook} />}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={`${tag} - ${config.title}`} />
				<meta name="twitter:url" content={config.siteUrl + location.pathname} />
				{config.twitter && (
					<meta
						name="twitter:site"
						content={`@${config.twitter.split('https://twitter.com/')[1]}`}
					/>
				)}
			</Helmet>
			<Wrapper>
				<header
					className="site-archive-header"
					css={[SiteHeader, SiteArchiveHeader]}
				>
					<div css={[outer, SiteNavMain]}>
						<div css={inner}>
							<SiteNav isHome={false} />
						</div>
					</div>
					<ResponsiveHeaderBackground
						css={[outer, SiteHeaderBackground]}
						// backgroundImage={tagData?.node?.image?.childImageSharp?.fluid?.src}
						className="site-header-background"
					>
						<SiteHeaderContent css={inner} className="site-header-content">
							<SiteTitle className="site-title">{tag}</SiteTitle>
							<SiteDescription className="site-description">
								All tags
								{/* {tagData?.node.description ? (
                  tagData.node.description
                ) : (
                  <>
                    A collection of {totalCount > 1 && `${totalCount} posts`}
                    {totalCount === 1 && '1 post'}
                    {totalCount === 0 && 'No posts'}
                  </>
                )} */}
							</SiteDescription>
						</SiteHeaderContent>
					</ResponsiveHeaderBackground>
				</header>
				<main id="site-main" css={[SiteMain, outer]}>
					<div css={inner}>
						<div css={[PostFeed]}>
							<ListContainer>
							{
								data.allMarkdownRemark.group.map(item => (
									<li>
										<a href={`/tags/${item.fieldValue}`}>{item.fieldValue} ({item.totalCount})</a>
									</li>
								))
							}
							</ListContainer>
							{/* {edges.map(({ node }) => (
                <PostCard key={node.fields.slug} post={node} />
              ))} */}
						</div>
					</div>
				</main>
				<Footer />
			</Wrapper>
		</IndexLayout>
	);
};

export default Tags;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;

const ListContainer = styled.ul`
	display: flex;
	flex-wrap: wrap;
	list-style: none;
	li {
		padding: 8px;
		a {

			color: #15171A;
			word-break: break-word;
			box-shadow: #15171A 0 -1px 0 inset;
			-webkit-transition: all 0.2s ease-in-out;
			transition: all 0.2s ease-in-out;
			@media (prefers-color-scheme: dark) {
				color: #fff;
			}
			&:hover {
				color: ${colors.blue};
			}
		}
	}
`