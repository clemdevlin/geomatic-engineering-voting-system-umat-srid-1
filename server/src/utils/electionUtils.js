import Election from '../models/Election.js';

export async function updateElectionStatus(){
  const current = new Date();
  await Election.updateMany({ start_at: { $lte: current }, status: 'not_started' }, { $set: { status: 'active' } });
  await Election.updateMany({ end_at: { $lte: current }, status: 'active' }, { $set: { status: 'ended' } });
}
