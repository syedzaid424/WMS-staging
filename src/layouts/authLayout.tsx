import { Col, Row } from 'antd'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='h-screen'>
      <Row className='h-full'>
        <Col xs={0} lg={12} className='rounded-tr-4xl rounded-br-4xl auth-left-container'></Col>
        <Col xs={24} lg={12} className='px-8 lg:px-0'><Outlet /></Col>
      </Row>
    </div>
  )
}

export default AuthLayout
