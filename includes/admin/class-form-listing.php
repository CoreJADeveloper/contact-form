<?php

/**
 * Created by PhpStorm.
 * User: Tauhidul Alam
 * Date: 05-02-18
 * Time: PM 9.40
 */

//Check if the file is directly accessed
if (!defined('ABSPATH')) {
    exit;
}
class ngForms_Listing
{
    public function __construct()
    {
        add_action('admin_init', array($this, 'init'));

        add_action('load-toplevel_page_ng-forms', array($this, 'screen_options'));
        add_filter('set-screen-option', array($this, 'screen_options_set'), 10, 3);
    }

    /**
     * Admin init to implement WordPress default post listing screen
     *
     * @since 1.0.0
     */
    public function init()
    {
        $page = isset($_GET['page']) ? $_GET['page'] : '';

        if ('ng-forms' === $page) {

            if (!class_exists('WP_List_Table')) {
                require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
            }

            require_once 'class-form-listing-table.php';

            add_action('ng_forms_admin_page', array($this, 'output'));

        }
    }

    /**
     * Manage top level page to list total number of posts
     *
     * @since 1.0.0
     */
    public function screen_options()
    {
        $screen = get_current_screen();

        if ('toplevel_page_ng-forms' !== $screen->id) {
            return;
        }

        add_screen_option(
            'per_page',
            array(
                'label' => __('Number of forms per page:', 'ngForms'),
                'option' => 'ng-forms_forms_per_page',
                'default' => apply_filters('ng-forms_overview_per_page', 20),
            )
        );
    }

    /**
     * Manage total forms number that would be shown at forms listing
     *
     * @since 1.0.0
     * @param mixed $status
     * @param string $option
     * @param mixed $value
     * @return mixed
     */
    function screen_options_set($status, $option, $value)
    {
        if ('ng-forms_forms_per_page' === $option) {
            return $value;
        }

        return $status;
    }

    /**
     * Display admin post listing page
     *
     * @since 1.0.0
     */
    public function output()
    {
        ?>
        <div id="ng-forms-overview" class="wrap ng-forms-admin-wrap">

            <h1 class="page-title">
                <?php _e('Forms', 'ngForms'); ?>
                <a href="<?php echo admin_url('admin.php?page=ng-add-form'); ?>"
                   class="add-new-h2 ng-forms-btn-orange"><?php _e('Add Form', 'ngForms'); ?></a>
            </h1>

            <?php
            $ngForms_table = new ngForms_Listing_Table;
            $ngForms_table->prepare_items();
            ?>

            <div class="ng-forms-admin-content">

                <form id="ng-forms-overview-table" method="get"
                      action="<?php echo admin_url('admin.php?page=ng-forms'); ?>">

                    <input type="hidden" name="post_type" value="angular-forms"/>

                    <input type="hidden" name="page" value="ng-forms"/>

                    <?php $ngForms_table->views(); ?>
                    <?php $ngForms_table->display(); ?>

                </form>

            </div>

        </div>
        <?php
    }
}

new ngForms_Listing;
