import React from 'react';
import styled from 'styled-components';

// Props: { url?: string | { url: string }, user?: string | { email?: string } }
const Avatar = ({ url, user }) => {
  const src = typeof url === 'string' ? url : url?.url;
  const alt = typeof user === 'string' ? user : user?.email || 'avatar';
  return (
    <Wrapper className="d-flex justify-content-center align-content-center">
      {src ? (
        <AvatarWrapper>
          <Image
            src={src}
            alt={alt}
            width={100}
            height={100}
            className="img-responsive rounded-circle border border-2"
          />
        </AvatarWrapper>
      ) : (
        <NameWraper>{alt}</NameWraper>
      )}
    </Wrapper>
  );
};

export default Avatar;

const Wrapper = styled.div``;

const AvatarWrapper = styled.div`
  width: 200px;
`;

const NameWraper = styled.div``;
const Image = styled.img``;
