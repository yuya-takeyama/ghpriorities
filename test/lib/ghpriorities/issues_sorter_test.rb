require 'ghpriorities/issues_sorter'

class GHPriorities::IssuesSorterTest < Test::Unit::TestCase
  sub_test_case '.group_and_sort' do
    setup do
      @priorities = {
        '1' => 3,
        '2' => 2,
        '5' => 1,
      }
      @issues = [
        {id: 1, title: 'One'},
        {id: 2, title: 'Two'},
        {id: 3, title: 'Three'},
        {id: 4, title: 'Four'},
        {id: 5, title: 'Five'},
      ]
    end

    test 'group prioritized/unprioritized issues and sort them' do
      result = GHPriorities::IssuesSorter.group_and_sort(priorities: @priorities, issues: @issues)

      assert_equal(result, {
        prioritized: [
          {id: 5, title: 'Five'},
          {id: 2, title: 'Two'},
          {id: 1, title: 'One'},
        ],
        unprioritized: [
          {id: 4, title: 'Four'},
          {id: 3, title: 'Three'},
        ],
      })
    end
  end
end
