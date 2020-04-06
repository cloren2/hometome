<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Ciudad;
use App\Entity\Preferencias;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username')
            ->add('nombre')
            ->add('Apellidos')
            ->add('foto', FileType::class,[
                'label'=> "Imagen:",
                'attr'=> ['class'=> 'form-control'],
                'data_class' => null,
                'mapped'=>false,
                'required' =>false
            ])
            ->add('fechaNac',DateType::class, array(
                'widget' => 'choice',
                'years' => range(date('Y'), date('Y')-80),
        
              ))
            ->add('ciudad', EntityType::class, [
                'class' => Ciudad::class,
                'choice_label' => 'nombre'
               
            ])
            ->add('preferencias', EntityType::class, [
                'class' => Preferencias::class,
                'choice_label' => 'nombre',
                'multiple' => true,
                'expanded' => true
            
            ])
            ->add('plainPassword', PasswordType::class, [
                // instead of being set onto the object directly,
                // this is read and encoded in the controller
                'mapped' => false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Introduce una contraseña',
                    ]),
                    new Length([
                        'min' => 4,
                        'minMessage' => 'Your password should be at least {{ limit }} characters',
                        // max length allowed by Symfony for security reasons
                        'max' => 4096,
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
