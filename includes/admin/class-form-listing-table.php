<?php

/**
 * Created by PhpStorm.
 * User: Tauhidul Alam
 * Date: 05-02-18
 * Time: PM 9.43
 */

//Check if the file is directly accessed
if (!defined('ABSPATH')) {
    exit;
}

class ngForms_Listing_Table extends WP_List_Table
{

    public $per_page;

    public function __construct()
    {

        global $status, $page;

        parent::__construct(
            array(
                'singular' => 'form',
                'plural' => 'forms',
                'ajax' => false,
            )
        );

        $this->per_page = apply_filters('ng_forms_overview_per_page', 20);
    }

    /**
     * Manage form listing screen columns
     *
     * @since 1.0.0
     * @return mixed
     */
    public function get_columns()
    {

        $columns = array(
            'cb' => '<input type="checkbox" />',
            'form_name' => __('Name', 'ngForms'),
            'shortcode' => __('Shortcode', 'ngForms'),
            'created' => __('Created', 'ngForms'),
        );

        return apply_filters('ng_forms_overview_table_columns', $columns);
    }

    /**
     * Manage posts selection through for bulk action
     *
     * @since 1.0.0
     * @param mixed $form
     * @return string
     */
    public function column_cb($form)
    {

        return '<input type="checkbox" name="form_id[]" value="' . absint($form->ID) . '" />';
    }

    /**
     * Implements default columns
     *
     * @since 1.0.0
     * @param mixed $form
     * @param string $column_name
     * @return mixed
     */
    public function column_default($form, $column_name)
    {

        switch ($column_name) {
            case 'id':
                $value = $form->ID;
                break;

            case 'shortcode':
                $value = '[ngForms id="' . $form->ID . '"]';
                break;

            case 'created':
                $value = get_the_date(get_option('date_format'), $form);
                break;

            case 'modified':
                $value = get_post_modified_time(get_option('date_format'), false, $form);
                break;

            case 'author':
                $author = get_userdata($form->post_author);
                $value = $author->display_name;
                break;

            case 'php':
                $value = '<code style="display:block;font-size:11px;">if( function_exists( \'wpforms_get\' ) ){ wpforms_get( ' . $form->ID . ' ); }</code>';
                break;

            default:
                $value = '';
        }

        return apply_filters('ng_forms_overview_table_column_value', $value, $form, $column_name);
    }

    /**
     * Manage form post edit/preview/delete actions
     *
     * @since 1.0.0
     * @param mixed $status
     * @param string $option
     * @param mixed $value
     * @return mixed
     */
    public function column_form_name($form)
    {

        $name = !empty($form->post_title) ? $form->post_title : $form->post_name;
        $name = sprintf(
            '<a class="row-title" href="%s" title="%s"><strong>%s</strong></a>',
            add_query_arg(
                array(
                    'id' => $form->ID,
                ),
                admin_url('admin.php?page=ng-edit-form')
            ),
            __('Edit this form', 'ngForms'),
            $name
        );

        $row_actions = array();

        $row_actions['edit'] = sprintf(
            '<a href="%s" title="%s">%s</a>',
            add_query_arg(
                array(
                    'id' => $form->ID,
                ),
                admin_url('admin.php?page=ng-edit-form')
            ),
            __('Edit this form', 'ngForms'),
            __('Edit', 'ngForms')
        );

        $row_actions['preview_'] = sprintf(
            '<a href="%s" title="%s" target="_blank" rel="noopener">%s</a>',
            esc_url($this->form_preview_url($form->ID)),
            __('View preview', 'ngForms'),
            __('Preview', 'ngForms')
        );


        $row_actions['delete'] = sprintf(
            '<a href="%s" title="%s">%s</a>',
            wp_nonce_url(
                add_query_arg(
                    array(
                        'action' => 'delete',
                        'form_id' => $form->ID,
                    ),
                    admin_url('admin.php?page=ng-forms')
                ),
                'ng_forms_delete_form_nonce'
            ),
            __('Delete this form', 'ngForms'),
            __('Delete', 'ngForms')
        );

        $value = $name . $this->row_actions($row_actions);

        return apply_filters('ng_forms_overview_row_actions', $value, $form);
    }

    /**
     * Get preview form URL
     *
     * @since 1.0.0
     * @param mixed $form_id
     * @return mixed
     */
    public function form_preview_url( $form_id ) {

        $id = get_option( 'ngContact_form_preview_page' );

        if ( ! $id ) {
            return home_url();
        }

        $url = get_permalink( $id );

        if ( ! $url ) {
            return home_url();
        }

        return add_query_arg(
            array(
                'form_id'         => absint( $form_id ),
            ),
            $url
        );
    }

    /**
     * Manage delete bulk action
     *
     * @since 1.0.0
     * @return mixed
     */
    public function get_bulk_actions()
    {

        $actions = array(
            'delete' => __('Delete', 'ngForms'),
        );
        return $actions;
    }

    /**
     * Process form post deletion action
     *
     * @since 1.0.0
     */
    public function process_bulk_actions()
    {

        $ids = isset($_GET['form_id']) ? $_GET['form_id'] : array();

        if (!is_array($ids)) {
            $ids = array($ids);
        }

        $ids = array_map('absint', $ids);
        $action = !empty($_REQUEST['action']) ? $_REQUEST['action'] : false;

        if (empty($ids) || empty($action)) {
            return;
        }

        if ('delete' === $this->current_action()) {

            if (
                wp_verify_nonce($_GET['_wpnonce'], 'bulk-forms') ||
                wp_verify_nonce($_GET['_wpnonce'], 'ng_forms_delete_form_nonce')
            ) {
                foreach ($ids as $id) {
                    wp_delete_post($id);
                }
                ?>
                <div class="notice updated">
                    <p>
                        <?php
                        if (count($ids) === 1) {
                            _e('Form was successfully deleted.', 'ngForms');
                        } else {
                            _e('Forms were successfully deleted.', 'ngForms');
                        }
                        ?>
                    </p>
                </div>
                <?php
            } else {
                ?>
                <div class="notice updated">
                    <p>
                        <?php _e('Security check failed. Please try again.', 'ngForms'); ?>
                    </p>
                </div>
                <?php
            }
        }
    }

    /**
     * Implements no item screen for post listing
     *
     * @since 1.0.0
     */
    public function no_items()
    {

        printf(__('No form created yet, <a href="%s">let\'s create a form</a>?', 'ngForms'), admin_url('admin.php?page=ng-add-form'));
    }

    /**
     * Manage created form post listing with generating table columns
     *
     * @since 1.0.0
     */
    public function prepare_items()
    {

        $this->process_bulk_actions();

        $columns = $this->get_columns();

        $hidden = array();

        $sortable = array(
            'form_name' => array('title', false),
            'created' => array('date', false),
        );

        $this->_column_headers = array($columns, $hidden, $sortable);

        $total = wp_count_posts('angular-forms')->publish;
        $page = $this->get_pagenum();
        $order = isset($_GET['order']) ? $_GET['order'] : 'DESC';
        $orderby = isset($_GET['orderby']) ? $_GET['orderby'] : 'ID';
        $per_page = $this->get_items_per_page('angular-forms_forms_per_page', $this->per_page);
        $data = $this->get_post_data('', array(
            'orderby' => $orderby,
            'order' => $order,
            'nopaging' => false,
            'posts_per_page' => $per_page,
            'paged' => $page,
            'no_found_rows' => false,
        ));

        $this->items = $data;

        $this->set_pagination_args(
            array(
                'total_items' => $total,
                'per_page' => $per_page,
                'total_pages' => ceil($total / $per_page),
            )
        );
    }

    /**
     * Retrieve specific post data
     *
     * @since 1.0.0
     * @param string $id
     * @param mixed $args
     * @return mixed
     */
    private function get_post_data($id = '', $args = array())
    {
        $args = apply_filters('ng_forms_get_form_args', $args);

        if (false === $id) {
            return false;
        }

        if (!empty($id)) {

            $forms = get_post(absint($id));

            if (!empty($args['content_only']) && !empty($forms) && 'angular-forms' === $forms->post_type) {
                $forms = $this->ng_forms_decode($forms->post_content);
            }
        } else {
            $defaults = array(
                'post_type' => 'angular-forms',
                'orderby' => 'id',
                'order' => 'ASC',
                'no_found_rows' => true,
                'nopaging' => true,
            );

            $args = wp_parse_args($args, $defaults);

            $args['post_type'] = 'angular-forms';

            $forms = get_posts($args);
        }

        if (empty($forms)) {
            return false;
        }

        return $forms;
    }

    /**
     * Decode array
     *
     * @since 1.0.0
     * @param mixed $data
     * @return mixed
     */
    private function ng_forms_decode( $data ) {
        if ( ! $data || empty( $data ) ) {
            return false;
        }

        return wp_unslash( json_decode( $data, true ) );
    }
}

