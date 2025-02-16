import { observer } from 'mobx-react';

import activityStore from '../../models/Activity';
import { AwardAssignment } from '../../models/Award';
import { ScrollList, ScrollListProps } from '../ScrollList';

interface AwardAssignmentProps extends ScrollListProps<AwardAssignment> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onDelete?: (id: AwardAssignment['id']) => any;
}

const TeamAwardAssignmentLayout = ({ value = [] }: AwardAssignmentProps) => (
  <>
    <ol>
      {value.map(({ updatedAt, id, description, awardId }) => (
        <li key={id} className="list-unstyled">
          {awardId || description}
        </li>
      ))}
    </ol>
  </>
);

@observer
export class TeamAwardAssignmentList extends ScrollList<AwardAssignmentProps> {
  store = activityStore
    .teamOf(this.props.activity)
    .assignmentOf(this.props.team);

  renderList() {
    return (
      <TeamAwardAssignmentLayout {...this.props} value={this.store.allItems} />
    );
  }
}
