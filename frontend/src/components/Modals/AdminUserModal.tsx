import axios from 'axios';
import { useRef } from 'react';
import type { User } from '@/types/next-auth';
import type { FormEvent } from 'react';
interface Props {
  user: User
  id: string
}

export default function AdminUserModal({ user, id }: Props) {
	const closeRef = useRef<HTMLButtonElement | null>(null);

	async function submitEvent(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const role = (document.getElementById(`${user.id}_role`) as HTMLSelectElement).value;

		const { data } = await axios.patch('/api/session/admin/users/update', {
			userId: user.id,
			role,
		});

		if (data.success) closeRef.current?.click();
	};


	async function resetToken() {
		try {
			const { data } = await axios.patch(`/api/session/admin/users/regenerate?userId=${user.id}`);
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="modal fade" id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="exampleModalLabel">Edit user: {user.username} ({user.id})</h1>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<form onSubmit={(e) => submitEvent(e)}>
						<div className="modal-body row">
							<div className="col-lg-6">
								<h5 className="fw-bold">Role</h5>
								<div className="input-group mb-3">
									<label className="input-group-text" htmlFor={`${user.id}_isBlocked`}>Role:</label>
									<select className="form-select" id={`${user.id}_role`} defaultValue={`${user.role}`}>
										<option value="BLOCK">Block</option>
										<option value="ADMIN">Admin</option>
										<option value="PREMIUM">Premium</option>
									</select>
								</div>
							</div>
							<div className="col-lg-6">
								<h5 className="fw-bold">Reset token?</h5>
								<button className="btn btn-success" onClick={() => resetToken()}>Confirm</button>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={closeRef}>Close</button>
							<button type="submit" className="btn btn-primary">Save changes</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
