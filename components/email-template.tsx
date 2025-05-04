import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface EmailTemplateProps {
  name?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `https://${process.env.NEXTAUTH_URL}`
  : '';

export const EmailTemplate = ({
  name,
  resetPasswordLink,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Dropbox reset your password</Preview>
        <Container style={container}>
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Please Verify your email to login .
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Verify Email
            </Button>
            <Text style={text}>Happy Shopping!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
