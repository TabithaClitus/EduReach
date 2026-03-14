import { useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from './QuizTake';

export default function Quiz() {
	const navigate = useNavigate();
	const quizzes = Object.entries(QUIZ_DATA);

	return (
		<div
			style={{
				minHeight: '100vh',
				background: '#F8FAFC',
				fontFamily: 'Inter, sans-serif',
				padding: '32px 24px 60px',
			}}
		>
			<div style={{ maxWidth: 960, margin: '0 auto' }}>
				<div style={{ marginBottom: 26 }}>
					<p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#2563EB' }}>QUIZZES</p>
					<h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: '#0F172A' }}>Practice by Subject</h1>
					<p style={{ margin: '10px 0 0', fontSize: 15, color: '#64748B' }}>
						Pick a quiz and test your understanding.
					</p>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
						gap: 16,
					}}
				>
					{quizzes.map(([id, quiz]) => (
						<button
							key={id}
							onClick={() => navigate('/quiz/' + id)}
							style={{
								textAlign: 'left',
								background: '#fff',
								border: '1px solid #E2E8F0',
								borderRadius: 14,
								padding: 20,
								cursor: 'pointer',
								boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
							}}
						>
							<span
								style={{
									display: 'inline-block',
									fontSize: 12,
									fontWeight: 700,
									color: quiz.color,
									background: quiz.bg,
									borderRadius: 999,
									padding: '5px 10px',
									marginBottom: 10,
								}}
							>
								{quiz.subject}
							</span>
							<h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{quiz.topic}</h3>
							<p style={{ margin: '8px 0 0', fontSize: 14, color: '#64748B' }}>
								{quiz.questions.length} questions
							</p>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
