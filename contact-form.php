<?php

/**
 * Plugin Name: WordPress Contact Form
 * Author: Tauhidul Alam
 * Description: A contact form :(
 */

if (!defined('ABSPATH')) {
    exit;
}

class ngContactForm
{
    protected static $_instance = null;

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function __construct()
    {
        global $endpoint;
        $endpoint = site_url('/wp-json/');

        $this->_actions();
        $this->_define();
        $this->_require();
    }

    private function _require()
    {
        if (is_admin()) {
            require_once ANGCF_PLUGIN_PATH . 'includes/admin/class-form-listing.php';
        }
    }

    private function _define()
    {
        define('ANGCF_PLUGIN_PATH', plugin_dir_path(__FILE__));
        define('ANGCF_PLUGIN_URL', plugins_url('/', __FILE__));
    }

    private function _actions()
    {
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        add_action('init', array($this, 'register_contact_form_post_type'));
        add_action('admin_menu', array($this, 'admin_contact_form_menu'));
        add_action('init', array($this, 'add_short_code'));
        add_action('wp_enqueue_scripts', array($this, 'ng_enqueue_script'));
        add_action('admin_enqueue_scripts', array($this, 'ng_admin_enqueue_script'));
        add_action('wp_ajax_send-ng-contact-email', array($this, 'ng_process_contact_email'));

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/create-post/', array(
                'methods' => 'POST',
                'callback' => array($this, 'create_custom_post'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/get-post/', array(
                'methods' => 'POST',
                'callback' => array($this, 'get_created_post_data'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/update-post/', array(
                'methods' => 'POST',
                'callback' => array($this, 'update_post_data'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/update-global-settings/', array(
                'methods' => 'POST',
                'callback' => array($this, 'update_global_settings'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });

        add_filter('the_posts', array($this, 'ng_load_contact_form_preview'), 10, 2);

        register_activation_hook(__FILE__, array($this, 'ng_create_preview_page'));
    }

    public function ng_admin_enqueue_script(){
        wp_enqueue_style('ng-admin-style', ANGCF_PLUGIN_URL. 'dist/admin-style.css');
    }

    public function ng_load_contact_form_preview($posts, $query)
    {
        if (!is_user_logged_in() || !current_user_can('manage_options')) {
            return $posts;
        }

        if (!$query->is_main_query()) {
            return $posts;
        }

        $id = absint(get_option('ngContact_form_preview_page'));

        $queried = $query->get_queried_object_id();
        if (
            $queried &&
            $queried !== $id &&
            isset($query->query_vars['page_id']) &&
            $id != $query->query_vars['page_id']
        ) {
            return $posts;
        }

        $form_id = $_GET['form_id'];

        if(!get_post_status($form_id))
            return $posts;

        $shortcode = ! empty( $form_id ) ? '[ngForms id="' . $form_id . '"]' : '';
        $content   = __( 'This is a preview of ngContact form. This page is not publicly accessible.', 'ngForms' );

        $posts[0]->post_content = $content . $shortcode;
        $posts[0]->post_status  = 'public';

        return $posts;
    }

    public function ng_create_preview_page()
    {
        $preview_page = array(
            'post_title' => wp_strip_all_tags('ngContact Form Preview'),
            'post_content' => 'This is a private page of ngContact Form. Please don\'t delete the page.',
            'post_status' => 'private',
            'post_author' => 1,
            'post_type' => 'page',
        );

        $page_id = wp_insert_post($preview_page);

        update_option('ngContact_form_preview_page', $page_id);
    }

    public function ng_process_contact_email()
    {
        unset($_POST['action']);

        $form_id = $_POST['form_id'];
        unset($_POST['form_id']);

        $form_fields = html_entity_decode(get_post_meta($form_id, 'ng_form_fields', true));
        $form_settings = html_entity_decode(get_post_meta($form_id, 'ng_form_settings', true));

        $form_fields_array = json_decode($form_fields);
        $form_settings_object = json_decode($form_settings);

        $form_fields_info = '';

        $user_email = '';

        foreach ($_POST as $value_array) {
            $index_count = 0;
            foreach ($value_array as $key => $value) {
                $form_fields_info .= $form_fields_array[$index_count]->label . ': ' . $value . "\n";

                if ($form_fields_array[$index_count]->type == 'email') {
                    $user_email = $value;
                }
                $index_count++;
            }
        }

        $send_to_email = $form_settings_object->send_to_email;
        $send_to_email = str_replace('{admin_email}', strval(get_bloginfo('admin_email')), $send_to_email);

        $email_subject = $form_settings_object->email_subject;
        $email_subject = str_replace('{site_title}', strval(get_bloginfo('name')), $email_subject);

        $user_info = get_userdata(1);

        $from_name = $form_settings_object->from_name;
        $from_name = str_replace('{admin_name}', strval($user_info->user_login), $from_name);

        $from_email = $form_settings_object->from_email;
        $from_email = str_replace('{admin_email}', strval(get_bloginfo('admin_email')), $from_email);

        $reply_to = $form_settings_object->reply_to;
        $reply_to = str_replace('{admin_email}', strval(get_bloginfo('admin_email')), $reply_to);

        $message = $form_settings_object->message;
        $message = str_replace('{form-fields}', strval($form_fields_info), $message);

        $name = $from_name;
        $email = $from_email;
        $subject = $email_subject;
        $to = $send_to_email;
        $headers = 'From: ' . $reply_to . "\r\n" .
            'Reply-To: ' . $reply_to . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        mail($to, $subject, $message, $headers, "From: " . $name);

        if ($user_email != '' && $form_settings_object->send_confirmation_email) {
            $confirmation_email_message = $form_settings_object->confirmation_email_message;

            mail($user_email, $subject, $confirmation_email_message);
        }

        die();
    }

    public function ng_enqueue_script()
    {
        wp_enqueue_script('angcf-script', ANGCF_PLUGIN_URL . 'dist/script.js');
    }

    public function add_short_code()
    {
        add_shortcode('ngForms', array($this, 'generate_short_code_content'));
    }

    public function generate_short_code_content($atts)
    {
        $short_code_atts = shortcode_atts(array(
            'id' => 0
        ), $atts);

        $form_id = $short_code_atts['id'];

        if ($form_id == 0)
            return false;

        wp_register_script('angcf-inline-script', ANGCF_PLUGIN_URL . 'dist/script.js', array('angcf-script'), false, true);
        wp_enqueue_script('angcf-inline-script');

        $form_fields = html_entity_decode(get_post_meta($form_id, 'ng_form_fields', true));
        $form_settings = html_entity_decode(get_post_meta($form_id, 'ng_form_settings', true));

        $form_fields_array = json_decode($form_fields);
        $form_fields_settings = json_decode($form_settings);

        ob_start();

//        echo '<pre>';
//        print_r($form_fields_settings);
//        echo '</pre>';

        if (isset($form_fields_settings->form_name) && !empty($form_fields_settings->form_name)) {
            echo <<<EOV
            <h3>{$form_fields_settings->form_name}</h3>
EOV;
        }

        echo <<<EOY
            <form action='#' method='post' class='{$form_fields_settings->form_css_classes} ng-contact-form-submit'>
EOY;


        foreach ($form_fields_array as $key => $field) {
            switch ($field->type) {
                case 'text':
                    echo $this->generate_text_field($key, $field);
                    break;

                case 'textarea':
                    echo $this->generate_textarea_field($key, $field);
                    break;

                case 'email':
                    echo $this->generate_email_field($key, $field);
                    break;

                case 'number':
                    echo $this->generate_number_field($key, $field);
                    break;

                case 'checkbox':
                    echo $this->generate_checkbox_field($key, $field);
                    break;

                case 'radio':
                    echo $this->generate_radio_field($key, $field);
                    break;

                case 'select':
                    echo $this->generate_select_field($key, $field);
                    break;

                case 'submit':
                    echo $this->generate_submit_field($field);
                    break;
            }
        }

        echo <<<EOY
            <input type='hidden' name='action' value='send-ng-contact-email' />
            <input type='hidden' name='form_id' value='{$form_id}' />
            </form>
EOY;

        $custom_form_submission = "
document.getElementsByClassName('ng-contact-form-submit')[0].addEventListener('submit', function (e) {
            e.preventDefault();

            let submit_button_element = document.getElementsByClassName('ng-contact-form-submit-button')[0];
            let submit_button_text = submit_button_element.value;

            submit_button_element.value = '" . $form_fields_settings->submit_button_processing_text . "';

            let url = '" . admin_url('admin-ajax.php') . "';
            let type = 'POST';

            let post_data = urlencodedFormData(new FormData(e.target));

            make_xhr_request(url, type, post_data, submit_button_text, submit_button_text);
        });

        function urlencodedFormData(fd){
            var s = '';
            function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
            for(var pair of fd.entries()){
                if(typeof pair[1]=='string'){
                    s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
                }
            }
            return s;
        }

        function create_CORS_request(method, url) {
            var xhr = new XMLHttpRequest();

            if ('withCredentials' in xhr) {
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != 'undefined') {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }
            return xhr;
        }


        function make_xhr_request(url, type, post_data, submit_button_text) {
            var xhr = create_CORS_request(type, url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if (!xhr) {
                throw new Error('CORS not supported');
            }

            // Response handlers.
            xhr.onload = function () {
                //let responseText = xhr.responseText;
                //let responseObject = JSON.parse(responseText);
                document.getElementsByClassName('ng-contact-form-submit-button')[0].value = submit_button_text;
                reset_form();
            };

            xhr.onerror = function () {
                throw new Error('Woops, there was an error making the request.');
            };

            xhr.send(post_data);
        }

        function reset_form() {
            document.getElementsByClassName('ng-contact-form-submit')[0].reset();
        }
        ";

        wp_add_inline_script('angcf-inline-script', $custom_form_submission);

        return ob_get_clean();
    }

    private function generate_text_field($key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        if ($field_object->hide_label && $field_object->required) {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <input type='text'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        } else {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <input type='text'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_textarea_field($key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        if ($field_object->hide_label && $field_object->required) {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <textarea
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'>{$field_object->default_value}</textarea>
                    </div>
EOF;
        } else {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <textarea
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'>{$field_object->default_value}</textarea>
                    </div>
EOF;
        }

        return $field_html_label . $field_html_input;

    }

    private function generate_email_field($key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        if ($field_object->hide_label && $field_object->required) {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <input type='email'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        } else {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <input type='email'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_number_field($key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        if ($field_object->hide_label && $field_object->required) {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <input type='number'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        } else {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <input type='number'
                    placeholder='{$field_object->placeholder}'
                    class='{$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$key}]'
                    value='{$field_object->default_value}' />
                    </div>
EOF;
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_checkbox_field($array_key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        $field_html_input = '';

        foreach ($field_object->choices as $key => $choice) {
            if ($choice->checked) {
                $checked = 'checked';
            } else {
                $checked = '';
            }
            if ($field_object->hide_label && $field_object->required) {
                $field_html_input .= <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <label>
                    <input type='checkbox'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$checked}
                    value='{$choice->text}'
                    {$required} name='ng-field[ng-field-{$array_key}]' />{$choice->text}</label>
                    </div>
EOF;
            } else {
                $field_html_input .= <<<EOF
                    <div class={$field_object->built_classes}>
                    <label>
                    <input type='checkbox'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$checked}
                    value='{$choice->text}'
                    {$required} name='ng-field[ng-field-{$array_key}]' />{$choice->text}</label>
                    </div>
EOF;
            }
        }

        if ($required == 'required') {
            $checkbox_required = "
        var checkbox_elements = document.getElementsByName('ng-field[ng-field-" . $array_key . "]');

        for (let el of checkbox_elements) {
          if (el.checked === true) {
            remove_required_attribute(checkbox_elements);
            break;
          }

          el.addEventListener( 'change', function() {
            if(this.checked) {
                remove_required_attribute(checkbox_elements);
            } else {
                check_required_attribute_checked(checkbox_elements);
            }
          });
        }

        function check_required_attribute_checked(checkbox_elements){
          for (let el of checkbox_elements) {
            if (el.checked === true) {
                remove_required_attribute(checkbox_elements);
                break;
            } else{
                add_required_attribute(checkbox_elements);
            }
          }
        }

        function remove_required_attribute(checkbox_elements){
            for (let el of checkbox_elements) {
              el.required = false;
            }
        }

        function add_required_attribute(checkbox_elements){
            for (let el of checkbox_elements) {
              el.required = true;
            }
        }
        ";
            wp_add_inline_script('angcf-inline-script', $checkbox_required);
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_radio_field($array_key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }

        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        $field_html_input = '';

        foreach ($field_object->choices as $key => $choice) {
            if ($field_object->choice_selected == $key) {
                $checked = 'checked';
            } else {
                $checked = '';
            }
            if ($field_object->hide_label && $field_object->required) {
                $field_html_input .= <<<EOF
                    <div class={$field_object->built_classes}>
                    <span class='required-field-class'>*</span>
                    <label>
                    <input type='radio'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$checked}
                    value='{$choice->text}'
                    {$required} name='ng-field[ng-field-{$array_key}]' />{$choice->text}</label>
                    </div>
EOF;
            } else {
                $field_html_input .= <<<EOF
                    <div class={$field_object->built_classes}>
                    <label>
                    <input type='radio'
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$checked}
                    value='{$choice->text}'
                    {$required} name='ng-field[ng-field-{$array_key}]' />{$choice->text}</label>
                    </div>
EOF;
            }
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_select_field($array_key, $field_object)
    {
        if ($field_object->required) {
            $required = 'required';
        } else {
            $required = '';
        }
        if (!$field_object->hide_label && $field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label} <span class='required-field-class'>*</span></label>
                    </div>
EOD;
        } else if (!$field_object->hide_label && !$field_object->required) {
            $field_html_label = <<<EOD
                    <div>
                    <label>{$field_object->label}</label>
                    </div>
EOD;
        } else {
            $field_html_label = '';
        }

        $field_html_options = '';

        foreach ($field_object->choices as $key => $choice) {
            if ($field_object->choice_selected == $key) {
                $selected = 'selected';
            } else {
                $selected = '';
            }

            $field_html_options .= <<<EOL
                    <option value='{$choice->text}' {$selected}>{$choice->text}</option>
EOL;
        }

        if ($field_object->hide_label && $field_object->required) {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <span><span class='required-field-class'>*</span></span>
                    <select
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$array_key}]'>{$field_html_options}</select>
                    </div>
EOF;
        } else {
            $field_html_input = <<<EOF
                    <div class={$field_object->built_classes}>
                    <select
                    class='{$field_object->built_classes} {$field_object->classes}'
                    {$required} name='ng-field[ng-field-{$array_key}]'>{$field_html_options}</select>
                    </div>
EOF;
        }

        return $field_html_label . $field_html_input;
    }

    private function generate_submit_field($field_object)
    {
        $field_html_submit = <<<EOF
                    <div class={$field_object->built_classes}>
                    <input type='submit'
                    class='{$field_object->classes} ng-contact-form-submit-button'
                    value='{$field_object->label}' />
                    </div>
EOF;


        return $field_html_submit;
    }

    public function update_global_settings(WP_REST_Request $request)
    {
        $parameters = $request->get_params();

        $global_settings = $parameters['global_settings'];

        update_option('ng_global_settings', $global_settings);

        return 'success';
    }

    public function update_post_data(WP_REST_Request $request)
    {
        $parameters = $request->get_params();

        $form_id = $parameters['form_id'];
        $form_title = $parameters['form_title'];
        $form_fields = $parameters['form_fields'];
        $form_settings = $parameters['form_settings'];

        if(isset($form_title) && !empty($form_title)) {
            $form_post = array(
                'ID' => $form_id,
                'post_title' => $form_title
            );
        } else{
            $form_post = array(
                'ID' => $form_id
            );
        }

        wp_update_post($form_post);

        update_post_meta($form_id, 'ng_default_form_type', $form_title);
        update_post_meta($form_id, 'ng_form_fields', $form_fields);
        update_post_meta($form_id, 'ng_form_settings', $form_settings);

        return 'success';
    }

    public function get_created_post_data(WP_REST_Request $request)
    {
        $parameters = $request->get_params();

        $form_id = $parameters['form_id'];

        $data['form_title'] = get_the_title($form_id);
        $data['form_type'] = get_post_meta($form_id, 'ng_default_form_type', true);
        $data['form_fields'] = get_post_meta($form_id, 'ng_form_fields', true);
        $data['settings_data'] = get_post_meta($form_id, 'ng_form_settings', true);

        return wp_json_encode($data);
    }

    public function create_custom_post(WP_REST_Request $request)
    {
        $parameters = $request->get_params();

        $title = $parameters['title'];
        $content = $parameters['content'];
        $status = $parameters['status'];
        $meta = $parameters['meta'];
        $default_form_type = $meta['default_form_type'];
        $form_fields = $meta['form_fields'];
        $settings_data = $meta['settings_data'];

        $angular_form_post = array(
            'post_title' => $title,
            'post_type' => 'angular-forms',
            'post_content' => $content,
            'post_status' => $status,
            'post_author' => get_current_user_id(),
        );

        $angular_form_post_id = wp_insert_post($angular_form_post);

        update_post_meta($angular_form_post_id, 'ng_default_form_type', $default_form_type);
        update_post_meta($angular_form_post_id, 'ng_form_fields', $form_fields);
        update_post_meta($angular_form_post_id, 'ng_form_settings', $settings_data);

        $redirect_url = admin_url('/admin.php?page=ng-edit-form&id=' . $angular_form_post_id);

        return $redirect_url;
    }

    public function admin_enqueue_scripts()
    {
        if (isset($_GET['page']) && ($_GET['page'] == 'ng-add-form' || $_GET['page'] == 'ng-edit-form' || $_GET['page'] == 'ng-settings')) {
            wp_enqueue_script('ang-script', ANGCF_PLUGIN_URL . 'dist/app.bundle.js', array(), '1.1.1', true);
            wp_enqueue_style('dragula-style', ANGCF_PLUGIN_URL . 'dist/dragula.min.css');
            wp_enqueue_style('material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons');
            wp_enqueue_style('ang-style', ANGCF_PLUGIN_URL . 'dist/styles.css');
        }
    }

    public function register_contact_form_post_type()
    {
        $labels = array(
            'name' => _x('NG Contact Forms', 'post type general name', 'ngForms'),
            'singular_name' => _x('NG Contact Form', 'post type singular name', 'ngForms'),
            'menu_name' => _x('NG Contact Forms', 'admin menu', 'ngForms'),
            'name_admin_bar' => _x('NG Contact Form', 'add new on admin bar', 'ngForms'),
            'add_new' => _x('Add New', 'ang-contact', 'ngForms'),
            'add_new_item' => __('Add New ', 'ngForms'),
            'new_item' => __('New Contact Form', 'ngForms'),
            'edit_item' => __('Edit Contact Form', 'ngForms'),
            'view_item' => __('View Contact Form', 'ngForms'),
            'all_items' => __('All Contact Forms', 'ngForms'),
            'search_items' => __('Search Contact Form', 'ngForms'),
            'parent_item_colon' => __('Parent Contact Form:', 'ngForms'),
            'not_found' => __('No Contact Form found.', 'ngForms'),
            'not_found_in_trash' => __('No Contact Form found in Trash.', 'ngForms')
        );

        $args = array(
            'labels' => $labels,
            'description' => __('Description.', 'ngForms'),
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => false,
            'show_in_menu' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'ang-contact'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments')
        );

        register_post_type('angular-forms', $args);
    }

    public function admin_contact_form_menu()
    {
        add_menu_page(
            __('ngContact Form', 'ngForms'),
            __('ngContact Form', 'ngForms'),
            'manage_options',
            'ng-forms',
            array($this, 'angular_forms'),
            'dashicons-feedback',
            apply_filters('ngForms_menu_position', '57.7'));
        add_submenu_page(
            'ng-forms',
            __('ngContact Form', 'ngForms'),
            __('All Forms', 'ngForms'),
            'manage_options',
            'ng-forms',
            array($this, 'angular_forms'));
        add_submenu_page(
            'ng-forms',
            __('ngContact Form', 'ngForms'),
            __('Add Form', 'ngForms'),
            'manage_options', 'ng-add-form',
            array($this, 'angular_add_form'));
//        add_submenu_page(
//            'ng-forms',
//            __('ngContact Form', 'ngForms'),
//            __('Settings', 'ngForms'),
//            'manage_options',
//            'ng-settings',
//            array($this, 'angular_settings'));
        $edit_hook = add_submenu_page(
            null,
            __('ngContact Form', 'ngForms'),
            __('Edit Form', 'ngForms'),
            'manage_options',
            'ng-edit-form',
            array($this, 'angular_edit_form'));

        add_action("admin_footer-$edit_hook", function () {
            echo <<<EOF
                <script type="text/javascript">
                    var ng_forms_element = document.getElementById("toplevel_page_ng-forms");
                    ng_forms_element.className += ' current wp-has-current-submenu wp-menu-open';
                </script>
EOF;
        });
    }

    public function angular_edit_form()
    {
        global $endpoint;
        $form_id = $_GET['id'];

        if (isset($form_id) && !empty($form_id) && get_post_status($form_id)) {
            $data['form_title'] = get_the_title($form_id);
            $data['form_type'] = get_post_meta($form_id, 'ng_default_form_type', true);
            $data['form_fields'] = get_post_meta($form_id, 'ng_form_fields', true);
            $data['settings_data'] = get_post_meta($form_id, 'ng_form_settings', true);

            ?>
            <script>
                sessionStorage.setItem('ng_form_title', '<?php echo html_entity_decode($data['form_title'])?>');
                sessionStorage.setItem('ng_form_type', '<?php echo html_entity_decode($data['form_type'])?>');
                sessionStorage.setItem('ng_form_fields', '<?php echo html_entity_decode($data['form_fields'])?>');
                sessionStorage.setItem('ng_settings_data', '<?php echo html_entity_decode($data['settings_data'])?>');
            </script>
            <contact-form type="edit" form_id="<?php echo $form_id ?>" endpoint="<?php echo $endpoint ?>"
                          nonce="<?php echo wp_create_nonce('wp_rest') ?>">
                <div class="ng-content-loader">
                    <h3 class="loader-text">Please wait...</h3>
                </div>
            </contact-form>
            <?php
        }
    }

    public function angular_forms()
    {
        if(isset($_GET['action']) && isset($_GET['form_id']) && $_GET['action'] == 'delete' && isset($_GET['_wpnonce']) && wp_verify_nonce($_GET['_wpnonce'])){
            $form_id = $_GET['form_id'];

            wp_delete_post( $form_id );
        }

        do_action('ng_forms_admin_page');
    }

    public function angular_add_form()
    {
        global $endpoint;
        ?>
        <contact-form type="add" endpoint="<?php echo $endpoint ?>" nonce="<?php echo wp_create_nonce('wp_rest') ?>">
            <div class="ng-content-loader">
                <h3 class="loader-text">Please wait...</h3>
            </div>
        </contact-form>
        <?php
    }

    public function angular_settings()
    {
        global $endpoint;
        if (get_option('ng_global_settings') != false) {
            ?>
            <script>
                sessionStorage.setItem('ng_global_settings', '<?php echo html_entity_decode(get_option('ng_global_settings'))?>');
                console.log(sessionStorage.getItem('ng_global_settings'));
            </script>
        <?php } ?>
        <contact-form type="settings" endpoint="<?php echo $endpoint ?>"
                      nonce="<?php echo wp_create_nonce('wp_rest') ?>">
            <div class="ng-content-loader">
                <h3 class="loader-text">Please wait...</h3>
            </div>
        </contact-form>
        <?php
    }
}

function contact_form()
{
    return ngContactForm::instance();
}

$GLOBALS['contact_form'] = contact_form();