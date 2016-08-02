class GHPriorities::IssuesSorter
  class << self
    def group_and_sort(priorities: , issues: )
      {
        prioritized: issues
          .select {|issue| priorities.key?(issue[:id]) }
          .sort_by {|issue| priorities[issue[:id]] },
        unprioritized: issues
          .select {|issue| !priorities.key?(issue[:id]) }
          .sort_by {|issue| -issue[:id] },
      }
    end
  end
end
