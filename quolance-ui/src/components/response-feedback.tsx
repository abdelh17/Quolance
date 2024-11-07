// Component that wraps the ErrorFeedback and SuccessFeedback components
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';

interface ResponseFeedbackProps {
  error?: HttpErrorResponse;
  isSuccess: boolean;
  successMessage: string;
}

const ResponseFeedback: React.FC<ResponseFeedbackProps> = ({
  error,
  isSuccess,
  successMessage,
}) => (
  <div className={`mt-4 ${error || isSuccess ? 'block' : 'hidden'}`}>
    {error && <ErrorFeedback data={error} />}
    <SuccessFeedback message={successMessage} show={isSuccess} />
  </div>
);

export default ResponseFeedback;
