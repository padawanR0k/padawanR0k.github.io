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
      <div ref={tocEl} id="toc" dangerouslySetInnerHTML={{ __html }} />
    </TocContainer>
  );
};

export default Toc;

const TocContainer = styled.div`
  @media (max-width: 767px) {
      display: none;
  }
  @media (max-width: 1339px) {
    display: none;
  }

	position: sticky;
  top: calc(64px + 16px);
  width: 300px;
  align-self: flex-start;

	ul {
    border-radius: 10px;
    padding-bottom: 0px;
    margin: 0;
		li {
      text-overflow: ellipsis;
			width: 200px;
			white-space: nowrap;
			overflow: hidden;
			font-size: 12px;
			white-space: normal;
		}
	}

  /* @media (prefers-color-scheme: dark) {
    ul {
      background: #1a1c20;
    }
  } */
`;
