import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Toc: React.FC<{ __html: string }> = ({ __html }) => {
  const tocEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    tocEl.current?.addEventListener('click', (e: any) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();

        const target = document.querySelector(`a[href="${e.target.getAttribute('href')}"].anchor`);
        const rect = target?.getBoundingClientRect();
        if (rect) {
          const { y } = rect;
          scrollBy(0, y - 64);
        }
      }
    });
  }, []);
  return (
    <TocContainer className="toc_container">
      <h2>Table Of Contents</h2>
      <div ref={tocEl} id="toc" dangerouslySetInnerHTML={{ __html }} />
    </TocContainer>
  );
};

export default Toc;

const TocContainer = styled.div`
  @media (max-width: 767px) {
      display: none;
  }
	position: sticky;
    right: 0;
    top: calc(64px + 16px);
    height: 0px;
    transform: translateX(110%);

	ul {
		li {
			text-overflow: ellipsis;
			width: 200px;
			white-space: nowrap;
			overflow: hidden;
			font-size: 12px;
			white-space: normal;
		}
	}
`;
