import styled from "@emotion/styled";

export interface ISeries {
	totalCount: number;
	edges: Array<{
		node: {
			series: string;
			timeToRead: number;
			frontmatter: {
				title: string;
				date: string;
			};
			fields: {
				slug: string;
			};
		};
	}>;
}

interface Props extends ISeries {
	currentSlug: string;
}

const SeriesList: React.FC<Props> = (props) => {
	return (
		<SeriesContainer>
			<Desc>
				{props.edges[0]?.node.series} 연재글 목록
			</Desc>
			<ol>
				{props.totalCount
					? props.edges.map(({node}) => (
						<SeriesListItem active={props.currentSlug === node.fields.slug}>
							<a href={node.fields.slug}>
								{node.frontmatter.title}
							</a>
						</SeriesListItem>
					))
					: null}
			</ol>
		</SeriesContainer>
	);
};

export default SeriesList;

const Desc = styled.h2`
	margin-top: 10px !important;
`;

const SeriesContainer = styled.section`
	/* background-color: #333; */
	box-shadow: 0px 5px 20px rgb(0 0 0 / 50%);
	padding: 8px 16px 8px 16px;
	border-radius: 5px;
	ol {
		margin-bottom: 0;
	}
`;

const SeriesListItem = styled.li<{active: boolean}>`
	font-weight: ${props => props.active ? 'bold' : 'normal'};
	text-decoration: ${props => props.active ? 'none' : 'none'};
	color: ${props => props.active ? '#fff' : '#777'};
	a {
		box-shadow: ${props => props.active ? '' : 'none'};
		color: ${props => props.active ? '#fff' : '#777'};
	}
	/* background-color: #333; */
`;