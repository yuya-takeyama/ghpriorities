require 'octokit'
require 'ghpriorities/issues_sorter'

class DashboardsController < ApplicationController
  before_action :set_dashboard, only: [:show, :edit, :update, :update_priorities, :destroy]

  # GET /dashboards
  def index
    @dashboards = Dashboard.all
  end

  # GET /dashboards/1
  def show
    priorities = begin JSON.parse(@dashboard.priorities_json) rescue {} end
    issues = octokit.search_issues(@dashboard.query, page: 1, per_page: 100).items.map(&:to_attrs)
    @issues = GHPriorities::IssuesSorter.sort(priorities: priorities, issues: issues)
  end

  # GET /dashboards/new
  def new
    @dashboard = Dashboard.new
  end

  # GET /dashboards/1/edit
  def edit
  end

  # POST /dashboards
  def create
    @dashboard = Dashboard.new(dashboard_params)

    if @dashboard.save
      redirect_to @dashboard, notice: 'Dashboard was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /dashboards/1
  def update
    if @dashboard.update(dashboard_params)
      redirect_to @dashboard, notice: 'Dashboard was successfully updated.'
    else
      render :edit
    end
  end

  # PUT /dashboards/1/priorities
  def update_priorities
    if @dashboard.update(update_priorities_params)
      head :no_content
    else
      head :bad_request
    end
  end

  # DELETE /dashboards/1
  def destroy
    @dashboard.destroy
    redirect_to dashboards_url, notice: 'Dashboard was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dashboard
      @dashboard = Dashboard.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def dashboard_params
      params.require(:dashboard).permit(:name, :query)
    end

    def update_priorities_params
      priorities = params.require(:dashboard).to_unsafe_h[:priorities]
      {priorities_json: priorities.to_json}
    end

    def octokit
      @octokit ||= Octokit::Client.new(access_token: ENV['GITHUB_API_TOKEN'])
    end
end
