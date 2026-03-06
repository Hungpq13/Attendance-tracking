import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Lưu trữ thông tin lỗi vào sessionStorage để hiển thị trên trang lỗi
    sessionStorage.setItem('lastError', JSON.stringify({
      code: '500',
      message: error?.message || 'Có lỗi xảy ra trong ứng dụng',
      details: errorInfo?.componentStack || error?.stack || '',
    }));
  }

  render() {
    if (this.state.hasError) {
      // Redirect to error page
      window.location.href = '/error';
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
